import ts from 'typescript';
import fs from 'fs/promises';
import path from 'path';
import {Node, Type, Project, SyntaxKind, FileSystemRefreshResult} from 'ts-morph';
import type {Plugin} from 'vite';
import type {OpenAPIV3} from 'openapi-types';

interface Endpoint {
    path: string;
    method: string;
    responses: OpenAPIV3.ResponsesObject;
    parameters: OpenAPIV3.ParameterObject[];
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

const parseEndpointFile = (project: Project, filePath: string) => {
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
            const endpoint: Endpoint = {
                path,
                method: methodName.toLowerCase(),
                responses: {},
                parameters: parameters.map(name => ({
                    in: 'path',
                    name,
                    schema: {type: 'string'},
                    required: true,
                })),
            };

            const textArguments = functionExpression
                .getDescendantsOfKind(SyntaxKind.CallExpression)
                .filter(callExpression => callExpression.getExpression().getText() === 'text' && callExpression.getArguments().length > 0)
                .map(callExpression => callExpression.getArguments());
            const jsonArguments = functionExpression
                .getDescendantsOfKind(SyntaxKind.CallExpression)
                .filter(callExpression => callExpression.getExpression().getText() === 'json' && callExpression.getArguments().length > 0)
                .map(callExpression => callExpression.getArguments());
            const errorArguments = functionExpression
                .getDescendantsOfKind(SyntaxKind.CallExpression)
                .filter(callExpression => callExpression.getExpression().getText() === 'error' && callExpression.getArguments().length > 0)
                .map(callExpression => callExpression.getArguments());

            for (const textArgument of textArguments) {
                const [, responseInitNode] = textArgument;

                const statusNode = responseInitNode
                    ?.getDescendantsOfKind(SyntaxKind.PropertyAssignment)
                    .find(property => property.getName() === 'status')
                    ?.getInitializerIfKind(SyntaxKind.NumericLiteral);
                const status = Node.isNumericLiteral(statusNode) ? statusNode.getLiteralValue() : 200;

                if (!endpoint.responses[status]) {
                    endpoint.responses[status] = {
                        content: {},
                        description: 'OK',
                    };
                }
                (endpoint.responses[status] as OpenAPIV3.ResponseObject).content!['text/text'] = {
                    schema: {type: 'string'},
                };
            }
            for (const jsonArgument of jsonArguments) {
                const [dataNode, responseInitNode] = jsonArgument;

                const statusNode = responseInitNode
                    ?.getDescendantsOfKind(SyntaxKind.PropertyAssignment)
                    .find(property => property.getName() === 'status')
                    ?.getInitializerIfKind(SyntaxKind.NumericLiteral);
                const status = Node.isNumericLiteral(statusNode) ? statusNode.getLiteralValue() : 200;

                if (Node.isObjectLiteralExpression(dataNode)) {
                    // TODO: handle unions

                    if (!endpoint.responses[status]) {
                        endpoint.responses[status] = {
                            content: {},
                            description: 'OK',
                        };
                    }
                    (endpoint.responses[status] as OpenAPIV3.ResponseObject).content!['application/json'] = {
                        schema: typeToJsonSchema(dataNode.getType(), dataNode),
                    };
                }
            }
            for (const errorArgument of errorArguments) {
                const [statusNode, messageNode] = errorArgument;

                if (Node.isNumericLiteral(statusNode)) {
                    const status = Node.isNumericLiteral(statusNode) ? statusNode.getLiteralValue() : undefined;

                    if (status) {
                        const message = Node.isStringLiteral(messageNode) ? messageNode.getLiteralValue() : statusCodes[status];

                        endpoint.responses[status] = {description: message ?? ''};
                    }
                }
            }

            endpoints.push(endpoint);
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
                    endpoints.push(...parseEndpointFile(project, path.relative(process.cwd(), file)));
                }
            }

            await fs.writeFile(options.output, JSON.stringify(createSpec(options, endpoints), null, 2), {encoding: 'utf8'});
        },
        async handleHotUpdate({file}) {
            if ((await project.getSourceFile(file)?.refreshFromFileSystem()) !== FileSystemRefreshResult.Deleted) {
                if (file.includes('src/routes/api/') && file.endsWith('+server.ts')) {
                    const updatedEndpoints = parseEndpointFile(project, path.relative(process.cwd(), file));

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
