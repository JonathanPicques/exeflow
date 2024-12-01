<script lang="ts">
    import Fuse from 'fuse.js';
    import moment from 'moment';

    import empty from './+empty.svg';

    import Logo from '$lib/core/widgets/Logo.svelte';
    import Navbar from '$lib/core/widgets/Navbar.svelte';
    import GithubLink from '$lib/core/widgets/GithubLink.svelte';
    import ProfileLink from '$lib/core/widgets/ProfileLink.svelte';

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

<Navbar>
    {#snippet left()}
        <Logo />
    {/snippet}
    {#snippet center()}
        <input type="search" placeholder="Filter projects..." bind:value={filter} />
    {/snippet}
    {#snippet right()}
        <button onclick={createProject}>+ New project</button>
        <!-- <a href="/auth/profile">Profile</a> -->
        <!-- <a href="/auth/logout" data-sveltekit-reload>Logout</a> -->
        <ProfileLink />
        <GithubLink />
    {/snippet}
</Navbar>

<main>
    <div class="projects">
        {#each filteredProjects as project}
            <div class="project">
                <a href="/project/{project.id}" aria-label="Open project {project.name}">
                    <img src={project.image === 'data:null' ? empty : project.image} alt="" />
                </a>
                <div>
                    <div>
                        <span class="title">{project.name}</span>
                        <span class="update">Updated {moment(project.updated_at).fromNow()}</span>
                    </div>
                    <button class="custom" onclick={() => removeProject(project.id)}>❌</button>
                </div>
            </div>
        {/each}
    </div>
</main>

<style>
    main {
        display: flex;
        overflow: auto;
        flex-grow: 1;
        padding-inline: 3rem;
        flex-direction: column;
    }

    input {
        width: clamp(10rem, 30%, 40rem);
    }

    .project {
        & img {
            width: 100%;
            border: 0.15rem solid var(--color-bg-2);
            border-radius: 1rem;

            background-color: var(--color-bg-1);

            transition: 0.3s;

            &:hover {
                border: 0.15rem solid var(--color-fg);
            }
        }

        & > div {
            display: flex;
            padding: 0.5rem;

            & > div {
                gap: 0.5rem;
                display: flex;

                flex-grow: 1;
                flex-direction: column;

                & > .title {
                    font-weight: bold;
                    font-size: 1.1rem;
                }
                & > .update {
                    color: var(--color-fg-1);
                    font-size: 0.8rem;
                }
            }

            & > button {
                margin: 0;
                padding: 0;
                background-color: transparent;
            }
        }
    }

    .projects {
        margin-top: 6rem;
        display: grid;
        grid-gap: 2rem;
        flex-grow: 1;
        align-content: start;
        grid-template-columns: repeat(auto-fill, minmax(clamp(15rem, 25vw, 25rem), 1fr));
    }
</style>
