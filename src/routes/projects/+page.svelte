<script lang="ts">
    import {fetchCreateProject, fetchDeleteProject} from '../api/project/project.api';
    import type {Project} from '../api/project/project.service';

    let {data} = $props();
    let projects: Project[] = $state(data.projects);

    const createProject = async () => {
        projects = [...projects, await fetchCreateProject({name: `Untitled project ${projects.length}`})];
    };

    const removeProject = async (id: string) => {
        await fetchDeleteProject({id});
        projects = projects.filter(p => p.id !== id);
    };
</script>

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
