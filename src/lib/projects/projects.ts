import {NoResultError} from 'kysely';

import {AppError} from '$lib/helper/appError';
import type {Db} from '$lib/supabase/db.server';
import type {AuthUser} from '$lib/supabase/user';
import type {PluginNode} from '$lib/graph/nodes';
import type {PluginEdge} from '$lib/graph/edges';
import type {ProjectsId} from '$lib/supabase/gen/public/Projects';

export interface Project {
    id: string;
    name: string;
    content: {nodes: PluginNode[]; edges: PluginEdge[]};
}

export const getProject = async (db: Db, {id}: Pick<Project, 'id'>) => {
    try {
        return (await db
            .selectFrom('projects')
            .select(['id', 'name', 'content'])
            .where('id', '=', id as ProjectsId)
            .executeTakeFirstOrThrow()) as Project;
    } catch (e) {
        if (e instanceof NoResultError) {
            throw new ProjectNotFoundError(id);
        }
        throw e;
    }
};

export const getProjects = async (db: Db, {ownerId}: {ownerId: AuthUser['id']}) => {
    return (await db.selectFrom('projects').select(['id', 'name', 'content']).where('owner_id', '=', ownerId).execute()) as Project[];
};

export const createProject = async (db: Db, {name, ownerId}: {name: Project['name']; ownerId: AuthUser['id']}) => {
    return (await db
        .insertInto('projects')
        .values({name, content: JSON.stringify({nodes: [], edges: []}), owner_id: ownerId})
        .returning(['id', 'name', 'content'])
        .executeTakeFirstOrThrow()) as Project;
};

export const deleteProject = async (db: Db, {id}: Pick<Project, 'id'>) => {
    try {
        await db
            .deleteFrom('projects')
            .where('id', '=', id as ProjectsId)
            .execute();
    } catch (e) {
        if (e instanceof NoResultError) {
            throw new ProjectNotFoundError(id);
        }
        throw e;
    }
};

export const updateProject = async (db: Db, {id, content}: Pick<Project, 'id' | 'content'>) => {
    try {
        await db
            .updateTable('projects')
            .where('id', '=', id as ProjectsId)
            .set({content: JSON.stringify(content)})
            .execute();
    } catch (e) {
        if (e instanceof NoResultError) {
            throw new ProjectNotFoundError(id);
        }
        throw e;
    }
};

export class ProjectNotFoundError extends AppError {
    constructor(id: string) {
        super(`project ${id} not found`, 404);
    }
}
