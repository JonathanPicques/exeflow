<script lang="ts">
    import {onMount} from 'svelte';
    import {_GET, _POST} from './api/project/fetch.client';
    import type {Project} from './api/project/api.server';
    import {_DELETE} from './api/project/[id]/fetch.client';

    export let data;

    let projects: Project[] = [];

    onMount(async () => {
        if (data.user) {
            projects = await _GET();
        }
    });

    const createProject = async () => {
        projects = [...projects, await _POST({name: `Untitled project ${projects.length}`})];
    };

    const removeProject = async (id: string) => {
        await _DELETE({id});
        projects = projects.filter(p => p.id !== id);
    };
</script>

{#if data.user}
    <div>
        <h1>My projects</h1>
        <ul>
            {#each projects as project}
                <li>
                    <a href="/project/{project.id}">{project.name}</a>
                    <button on:click={() => removeProject(project.id)}>❌</button>
                </li>
            {/each}
        </ul>
        <button on:click={createProject}>Create new project</button>
        <a href="/auth/logout" data-sveltekit-reload>Logout</a>
    </div>
{:else}
    <div>
        <h1>Landing page</h1>
        <nav>
            <ul>
                <li><a href="/auth/login">Login</a></li>
                <li><a href="/auth/register">Register</a></li>
            </ul>
        </nav>
    </div>
{/if}
