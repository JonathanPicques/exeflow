<script lang="ts">
    import Fuse from 'fuse.js';

    import empty from './empty.svg';
    import {postProject, deleteProject} from '../api/project/project';
    import type {Project} from '../api/project/project';

    let {data} = $props();
    let filter = $state('');
    let projects: Project[] = $state(data.projects);

    const filteredProjects = $derived.by(() => {
        if (filter === '') return projects;

        const fuse = new Fuse(projects, {keys: ['name']});
        const found = fuse.search(filter);
        return found.map(f => f.item);
    });

    const createProject = async () => {
        projects = [await postProject({name: `Untitled project ${projects.length}`}), ...projects];
    };

    const removeProject = async (id: string) => {
        await deleteProject({id});
        projects = projects.filter(p => p.id !== id);
    };
</script>

<svelte:head>
    <title>Exeflow - Home</title>
</svelte:head>

<nav>
    <div>
        <a href="/">Exeflow</a>
    </div>
    <div class="filter">
        <input type="search" placeholder="Filter projects..." bind:value={filter} />
    </div>
    <div>
        <button onclick={createProject}>New project</button>
        <a href="/auth/profile">{data.user.email}</a>
        <a href="/auth/logout" data-sveltekit-reload>Logout</a>
        <a href="https://github.com/JonathanPicques/exeflow">Github</a>
    </div>
</nav>

<main>
    <div class="projects">
        {#each filteredProjects as project}
            <div class="project">
                <a href="/project/{project.id}">
                    <img src={project.image === 'data:null' ? empty : project.image} alt="" width="320px" height="180px" />
                </a>
                <div style:display="flex">
                    <div style:display="flex" style:flex-grow="1" style:flex-direction="column">
                        <span>{project.name}</span>
                        <span>By author</span>
                    </div>
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

        & > div {
            gap: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        & > div.filter {
            flex-grow: 1;

            & > input {
                width: 30rem;
            }
        }
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
