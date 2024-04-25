<script lang="ts">
    import {_POST} from './api/project/fetch.client';
    import {_DELETE} from './api/project/[id]/fetch.client';

    export let data;

    async function createProject() {
        const project = await _POST();

        data.projects.push(project);
        data.projects = data.projects;
    }

    async function removeProject(id: string) {
        await _DELETE({id});

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
