import {edges} from '$lib/graph/edges';
import {nodes, type AnyNode} from '$lib/graph/nodes';
import type {Db} from '$lib/supabase/db.server';
import type {Edge} from '@xyflow/svelte';
import type {AuthUser} from '$lib/supabase/user';

export interface Project {
    id: string;
    name: string;
    content: {nodes: AnyNode[]; edges: Edge[]};
}

export const getProject = async (db: Db, {id}: Pick<Project, 'id'>) => {
    return (await db.selectFrom('projects').select(['id', 'name', 'content']).where('id', '=', id).executeTakeFirstOrThrow()) as Project;
};

export const getProjects = async (db: Db, {ownerId}: {ownerId: AuthUser['id']}) => {
    return (await db.selectFrom('projects').select(['id', 'name', 'content']).where('owner_id', '=', ownerId).execute()) as Project[];
};

export const createProject = async (db: Db, {name, ownerId}: {name: Project['name']; ownerId: AuthUser['id']}) => {
    const content = JSON.stringify({nodes, edges});
    return (await db.insertInto('projects').values({name, content, owner_id: ownerId}).returning(['id', 'name', 'content']).executeTakeFirstOrThrow()) as Project;
};

export const deleteProject = async (db: Db, {id}: Pick<Project, 'id'>) => {
    await db.deleteFrom('projects').where('id', '=', id).execute();
};

export const updateProject = async (db: Db, {id, content}: Pick<Project, 'id' | 'content'>) => {
    await db
        .updateTable('projects')
        .where('id', '=', id)
        .set({content: JSON.stringify(content)})
        .execute();
};
