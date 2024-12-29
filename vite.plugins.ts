import ts from 'typescript';
import fs from 'fs/promises';
import path from 'path';
import {Node, Type, Project, SyntaxKind, ThrowStatement, ReturnStatement, FileSystemRefreshResult} from 'ts-morph';
import type {Plugin} from 'vite';
import type {OpenAPIV3} from 'openapi-types';

interface Endpoint {
    path: string;
    method: string;
    responses: OpenAPIV3.ResponsesObject;
    parameters?: OpenAPIV3.ParameterObject[];
    requestBody?: OpenAPIV3.RequestBodyObject;
}

interface MergedOptions {
    output: string;
    openapi: Omit<OpenAPIV3.Document, 'openapi' | 'paths'>;
    include?: string[];
}

interface PluginOptions {
    output?: MergedOptions['output'];
    openapi: MergedOptions['openapi'];
    include?: MergedOptions['include'];
}

const statusCodes: Record<number, string | undefined> = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    500: 'Internal Server Error',
};

const createSpec = (options: MergedOptions, endpoints: Endpoint[]): OpenAPIV3.Document => {
    const paths: Record<string, OpenAPIV3.PathItemObject> = {};

    for (const endpoint of endpoints.toSorted((a, b) => a.path.localeCompare(b.path))) {
        paths[endpoint.path] = {
            ...paths[endpoint.path],
            [endpoint.method]: {
                responses: endpoint.responses,
                parameters: endpoint.parameters,
            },
        };
    }

    return {
        openapi: '3.0.0',
        ...options.openapi,
        paths,
    };
};

const createProject = (options: MergedOptions) => {
    const project = new Project({
        tsConfigFilePath: ts.findConfigFile(process.cwd(), ts.sys.fileExists, path.join('.svelte-kit', 'tsconfig.json')),
        skipAddingFilesFromTsConfig: options.include !== undefined,
    });

    if (options.include) {
        project.addSourceFilesAtPaths(options.include);
        project.resolveSourceFileDependencies();
    }
    return project;
};

const typeToJsonSchema = (type: Type, location: Node): OpenAPIV3.SchemaObject => {
    if (type.isString() || type.isStringLiteral()) {
        return {type: 'string'};
    } else if (type.isNumber() || type.isNumberLiteral()) {
        return {type: 'number'};
    } else if (type.isBoolean() || type.isBooleanLiteral()) {
        return {type: 'boolean'};
    } else if (type.isArray()) {
        return {type: 'array', items: typeToJsonSchema(type.getArrayElementType()!, location)};
    } else if (type.isObject()) {
        return {
            type: 'object',
            properties: type.getProperties().reduce(
                (acc, property) => {
                    acc[property.getName()] = typeToJsonSchema(property.getTypeAtLocation(location), location);
                    return acc;
                },
                {} as Record<string, OpenAPIV3.SchemaObject>,
            ),
        };
    }
    return {};
};

const parseResponseInit = (responseInitNode: Node) => {
    const properties = responseInitNode.getDescendantsOfKind(SyntaxKind.PropertyAssignment);
    const statusNode = properties.find(property => property.getName() === 'status')?.getInitializerIfKind(SyntaxKind.NumericLiteral);
    const headersNode = properties.find(property => property.getName().toLowerCase() === 'headers')?.getDescendantsOfKind(SyntaxKind.PropertyAssignment);
    const contentTypeNode = headersNode?.find(property => property.getName() === "'content-type'")?.getInitializerIfKind(SyntaxKind.StringLiteral);

    return {
        status: statusNode?.getLiteralValue(),
        contentType: contentTypeNode?.getLiteralValue(),
    };
};

const parseThrowStatement = (throwStatement: ThrowStatement) => {
    const callExpression = throwStatement.getExpressionIfKind(SyntaxKind.CallExpression);
    if (callExpression) {
        if (callExpression.getExpression().getText() === 'error') {
            const [statusNode, bodyNode] = callExpression.getArguments();

            if (Node.isNumericLiteral(statusNode)) {
                return {
                    body: bodyNode ? typeToJsonSchema(bodyNode.getType(), bodyNode) : ({type: 'string'} satisfies OpenAPIV3.SchemaObject),
                    status: statusNode.getLiteralValue(),
                    contentType: 'text/plain',
                };
            }
        }
    }
};

const parseReturnStatement = (returnStatement: ReturnStatement) => {
    const newExpression = returnStatement.getExpressionIfKind(SyntaxKind.NewExpression);
    if (newExpression) {
        if (newExpression.getExpression().getText() === 'Response') {
            const [bodyNode, responseInitNode] = newExpression.getArguments();
            const {status, contentType} = responseInitNode ? parseResponseInit(responseInitNode) : {};

            return {
                body: typeToJsonSchema(bodyNode.getType(), bodyNode),
                status: status ?? 200, // new Response() defaults to 200
                contentType: contentType ?? 'text/plain', // new Response() defaults to text/plain in SvelteKit
            };
        }
    }

    const callExpression = returnStatement.getExpressionIfKind(SyntaxKind.CallExpression);
    if (callExpression) {
        const text = callExpression.getExpression().getText();

        switch (text) {
            case 'json': {
                const [bodyNode, responseInitNode] = callExpression.getArguments();
                const {status, contentType} = responseInitNode ? parseResponseInit(responseInitNode) : {};

                return {
                    body: typeToJsonSchema(bodyNode.getType(), bodyNode),
                    status: status ?? 200, // calling json({}) defaults to 200
                    contentType: contentType ?? 'application/json', // calling json({...}) defaults to application/json
                };
            }
            case 'text': {
                const [, responseInitNode] = callExpression.getArguments();
                const {status, contentType} = responseInitNode ? parseResponseInit(responseInitNode) : {};

                return {
                    body: {type: 'string'} satisfies OpenAPIV3.SchemaObject,
                    status: status ?? 200, // calling text('...') defaults to 200
                    contentType: contentType ?? 'text/plain', // calling text('...') defaults to text/plain
                };
            }
        }
    }
};

const parseEndpointHandler = (project: Project, filePath: string) => {
    const path = filePath
        .replace(/^src\/routes/, '')
        .replace(/\+server\.ts$/, '')
        .replace(/\[([^\]]+)\]/g, '{$1}');
    const endpoints: Endpoint[] = [];
    const sourceFile = project.getSourceFile(filePath)!;
    const parameters = path.match(/{([^}]+)}/g)?.map(p => p.slice(1, -1)) ?? [];

    for (const methodName of ['GET', 'PUT', 'POST', 'PATCH', 'DELETE']) {
        const functionExpression =
            sourceFile.getFunction(methodName) ??
            sourceFile.getVariableDeclaration(methodName)?.getInitializerIfKind(SyntaxKind.ArrowFunction) ??
            sourceFile.getVariableDeclaration(methodName)?.getInitializerIfKind(SyntaxKind.FunctionExpression);

        if (functionExpression) {
            const throwStatements = functionExpression
                .getDescendantsOfKind(SyntaxKind.ThrowStatement)
                .map(throwStatement => parseThrowStatement(throwStatement))
                .filter(result => result !== undefined);
            const returnStatements = functionExpression
                .getDescendantsOfKind(SyntaxKind.ReturnStatement)
                .map(returnStatement => parseReturnStatement(returnStatement))
                .filter(result => result !== undefined);
            const bodyByStatusAndContentType = [...throwStatements, ...returnStatements].reduce(
                (acc, {body, status, contentType}) => {
                    return {
                        ...acc,
                        [status]: {
                            ...acc[status],
                            [contentType]: [...(acc[status]?.[contentType] ?? []), body],
                        },
                    };
                },
                {} as Record<string, Record<string, OpenAPIV3.SchemaObject[]>>,
            );

            endpoints.push({
                path,
                method: methodName.toLowerCase(),
                responses: Object.entries(bodyByStatusAndContentType).reduce(
                    (acc, [status, contentTypes]) => {
                        return {
                            ...acc,
                            [status]: {
                                content: Object.entries(contentTypes).reduce(
                                    (acc, [contentType, bodies]) => {
                                        return {
                                            ...acc,
                                            [contentType]: {
                                                schema: bodies.length === 1 ? bodies[0] : {oneOf: bodies},
                                            },
                                        };
                                    },
                                    {} as Record<string, OpenAPIV3.MediaTypeObject>,
                                ),
                                description: statusCodes[parseInt(status)] ?? 'No description',
                            },
                        };
                    },
                    {} as Record<string, OpenAPIV3.ResponseObject>,
                ),
                parameters:
                    parameters.length === 0
                        ? undefined
                        : parameters.map(name => ({
                              in: 'path',
                              name,
                              schema: {type: 'string'},
                              required: true,
                          })),
            });
        }
    }

    return endpoints;
};

export const sveltekitOpenapi = (pluginOptions: PluginOptions): Plugin => {
    const options = {
        output: path.join('src', 'routes', 'api', 'openapi.json'),
        ...pluginOptions,
    } satisfies MergedOptions;
    const project = createProject(options);
    const endpoints: Endpoint[] = [];

    return {
        name: 'vite-plugin-sveltekit-openapi',
        async buildStart() {
            for (const sourceFile of project.getSourceFiles()) {
                const file = sourceFile.getFilePath();

                if (file.includes('src/routes/api/') && file.endsWith('+server.ts')) {
                    endpoints.push(...parseEndpointHandler(project, path.relative(process.cwd(), file)));
                }
            }

            await fs.writeFile(options.output, JSON.stringify(createSpec(options, endpoints), null, 2), {encoding: 'utf8'});
        },
        async handleHotUpdate({file}) {
            if ((await project.getSourceFile(file)?.refreshFromFileSystem()) !== FileSystemRefreshResult.Deleted) {
                if (file.includes('src/routes/api/') && file.endsWith('+server.ts')) {
                    const updatedEndpoints = parseEndpointHandler(project, path.relative(process.cwd(), file));

                    for (const endpoint of updatedEndpoints) {
                        const existingEndpointIndex = endpoints.findIndex(e => e.path === endpoint.path && e.method === endpoint.method);

                        if (existingEndpointIndex !== -1) {
                            endpoints[existingEndpointIndex] = endpoint;
                        } else {
                            endpoints.push(endpoint);
                        }
                    }

                    await fs.writeFile(options.output, JSON.stringify(createSpec(options, endpoints), null, 2), {encoding: 'utf8'});
                }
            }
        },
    };
};
