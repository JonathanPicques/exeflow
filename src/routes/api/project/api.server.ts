import type {Db} from '$lib/supabase/db.server';

export interface Project {
    id: string;
    name: string;
    content: {nodes: unknown[]; edges: unknown[]};
}

export const getProject = async (db: Db, {id}: {id: string}) => {
    return (await db.selectFrom('projects').select(['id', 'name', 'content']).where('id', '=', id).executeTakeFirstOrThrow()) as Project;
};

export const getProjects = async (db: Db, {userId}: {userId: string}) => {
    return (await db.selectFrom('projects').select(['id', 'name', 'content']).where('owner_id', '=', userId).execute()) as Project[];
};

export const createProject = async (db: Db, {name, userId}: {name: string; userId: string}) => {
    return (await db.insertInto('projects').values({name, owner_id: userId}).returning(['id', 'name', 'content']).executeTakeFirstOrThrow()) as Project;
};

export const deleteProject = async (db: Db, {id}: {id: string}) => {
    await db.deleteFrom('projects').where('id', '=', id).execute();
};
