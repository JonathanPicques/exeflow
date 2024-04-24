export async function load({locals}) {
    const user = await locals.user();
    const projects = await locals.db.selectFrom('projects').select(['id', 'name']).execute();

    return {user, projects};
}
