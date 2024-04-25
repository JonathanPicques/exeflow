export async function load({locals}) {
    return {user: await locals.user()};
}
