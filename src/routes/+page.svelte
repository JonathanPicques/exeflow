<script lang="ts">
    import {onMount} from 'svelte';

    import {fetchListProjects, fetchCreateProject, fetchDeleteProject} from './api/project.api';
    import type {Project} from '$lib/projects/projects';

    let {data} = $props();
    let projects: Project[] = $state([]);

    onMount(async () => {
        if (data.user) {
            projects = await fetchListProjects();
        }
    });

    const createProject = async () => {
        projects = [...projects, await fetchCreateProject({name: `Untitled project ${projects.length}`})];
    };

    const removeProject = async (id: string) => {
        await fetchDeleteProject({id});
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
                    <button onclick={() => removeProject(project.id)}>❌</button>
                </li>
            {/each}
        </ul>
        <button onclick={createProject}>Create new project</button>
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
<div>
    <ul>
        <li><a href="http://127.0.0.1:54323" target="_blank">Supabase Studio</a></li>
        <li><a href="http://127.0.0.1:54324" target="_blank">Supabase Inbucket</a></li>
    </ul>
</div>
