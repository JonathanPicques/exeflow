<script lang="ts">
    import empty from './empty.svg';
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

<main>
    <h1>My projects</h1>
    <div>
        <button onclick={createProject}>Create new project</button>
        <a href="/auth/logout" data-sveltekit-reload>Logout</a>
    </div>
    <div class="projects">
        {#each projects as project}
            <div class="project">
                <img src={project.image === 'data:null' ? empty : project.image} alt="" />
                <div style:display="flex">
                    <a href="/project/{project.id}" style:flex-grow="1">{project.name}</a>
                    <button class="custom" onclick={() => removeProject(project.id)}>❌</button>
                </div>
            </div>
        {/each}
    </div>
</main>

<style>
    main {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
    }

    .project {
        padding: 1rem;

        & img {
            width: 320px;
            height: 180px;
            border-radius: 0.5rem;
            background-color: var(--color-bg-1);
        }
    }

    .projects {
        display: grid;
        grid-gap: 1rem 1rem;
        flex-grow: 1;
        grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    }
</style>
