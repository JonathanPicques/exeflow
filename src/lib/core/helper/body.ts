import type {z} from 'zod';

export const parseBody = async <T extends z.Schema>(req: Request, schema: T): Promise<{data: z.infer<T>; error: undefined} | {data: undefined; error: {message: string}}> => {
    const body = await req.json();
    const result = await schema.safeParseAsync(body);

    if (result.success) {
        return {data: result.data, error: undefined};
    }
    return {data: undefined, error: {message: result.error.message}};
};
