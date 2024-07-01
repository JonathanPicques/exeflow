<script lang="ts">
    import empty from './empty.svg';
    import {postProject, deleteProject} from '../api/project/project';
    import type {Project} from '../api/project/project';

    let {data} = $props();
    let projects: Project[] = $state(data.projects);

    const createProject = async () => {
        projects = [await postProject({name: `Untitled project ${projects.length}`}), ...projects];
    };

    const removeProject = async (id: string) => {
        await deleteProject({id});
        projects = projects.filter(p => p.id !== id);
    };
</script>

<nav>
    <div style:flex-grow="1">
        <a href="/">Home</a>
    </div>
    <div>
        <span>{data.user.email}</span>
        <a href="/auth/logout" data-sveltekit-reload>Logout</a>
    </div>
</nav>

<main>
    <div>
        <button onclick={createProject}>Create new project</button>
    </div>

    <div class="projects">
        {#each projects as project}
            <div class="project">
                <a href="/project/{project.id}"><img src={project.image === 'data:null' ? empty : project.image} alt="" /></a>
                <div style:display="flex">
                    <a href="/project/{project.id}" style:flex-grow="1">{project.name}</a>
                    <button class="custom" onclick={() => removeProject(project.id)}>❌</button>
                </div>
            </div>
        {/each}
    </div>
</main>

<style>
    nav {
        gap: 1rem;
        display: flex;
        padding: 1rem;
        border-bottom: 1px solid var(--color-bg-1);
    }

    main {
        gap: 1rem;
        display: flex;
        padding: 1rem;
        flex-grow: 1;
        flex-direction: column;
    }

    .project {
        & img {
            width: 100%;
            border-radius: 0.5rem;
            background-color: var(--color-bg-1);
        }

        & button {
            margin: 0;
            padding: 0;
            background-color: transparent;
        }
    }

    .projects {
        display: grid;
        grid-gap: 1rem 1rem;
        flex-grow: 1;
        align-content: start;
        grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    }
</style>
