import {NoResultError} from 'kysely';
import type {User} from '@supabase/supabase-js';
import type {Viewport} from '@xyflow/svelte';

import {AppError} from '$lib/helper/error';
import type {Db} from '$lib/supabase/db.server';
import type {Graph} from '$lib/core/core';
import type {ProjectsId} from '$lib/supabase/gen/public/Projects';

export interface Project {
    id: string;
    name: string;
    image: string;
    content: Graph & {viewport?: Viewport};
}

export const getProject = async (db: Db, {id}: Pick<Project, 'id'>) => {
    try {
        return (await db
            .selectFrom('projects')
            .select(['id', 'name', 'image', 'content'])
            .where('id', '=', id as ProjectsId)
            .executeTakeFirstOrThrow()) as Project;
    } catch (e) {
        if (e instanceof NoResultError) {
            throw new ProjectNotFoundError(id);
        }
        throw e;
    }
};

export const getProjects = async (db: Db, {ownerId}: {ownerId: User['id']}) => {
    return (await db.selectFrom('projects').select(['id', 'name', 'image', 'content']).where('owner_id', '=', ownerId).execute()) as Project[];
};

export const createProject = async (db: Db, {name, ownerId}: {name: Project['name']; ownerId: User['id']}) => {
    return (await db
        .insertInto('projects')
        .values({name, content: JSON.stringify({nodes: [], edges: []}), owner_id: ownerId})
        .returning(['id', 'name', 'image', 'content'])
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

export const updateProject = async (db: Db, {id, image, content}: Pick<Project, 'id' | 'image' | 'content'>) => {
    try {
        await db
            .updateTable('projects')
            .where('id', '=', id as ProjectsId)
            .set({
                image,
                content: JSON.stringify(content),
            })
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
