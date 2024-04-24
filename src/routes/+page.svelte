<script lang="ts">
    export let data;

    async function createProject() {
        const response = await fetch('/project/new', {method: 'POST'});
        const project = await response.json();

        data.projects.push(project);
        data.projects = data.projects;
    }

    async function removeProject(id: string) {
        await fetch(`/project/${id}/api`, {method: 'DELETE'});

        data.projects = data.projects.filter(p => p.id !== id);
    }
</script>

<main>
    {#if data.user.type === 'anon'}
        <div>
            <span>Anon #{data.user.id}</span>
            <a href="/auth/register">Save your work by creating an account!</a>
        </div>
    {/if}
    {#if data.user.type === 'user'}
        <div>
            <span>{data.user.email}</span>
            <a href="/auth/logout">Logout</a>
        </div>
    {/if}

    <h1>My projects</h1>
    <div>
        <button on:click={createProject}>Create project</button>
        {#each data.projects as { id, name }}
            <div>
                <a href="/project/{id}">{name}</a>
                <button on:click={() => removeProject(id)}>x</button>
            </div>
        {/each}
    </div>
</main>
