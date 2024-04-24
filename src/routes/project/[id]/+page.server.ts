export async function load({locals, params}) {
    const project = await locals.db.selectFrom('projects').selectAll().executeTakeFirstOrThrow();

    return {project};
}
