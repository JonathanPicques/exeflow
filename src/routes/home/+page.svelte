<script lang="ts">
    import Fuse from 'fuse.js';
    import moment from 'moment';
    import {goto} from '$app/navigation';

    import empty from './+empty.svg';

    import Logo from '$lib/core/widgets/Logo.svelte';
    import Trash from '$lib/core/widgets/icons/Trash.svelte';
    import Navbar from '$lib/core/widgets/Navbar.svelte';
    import GithubLink from '$lib/core/widgets/GithubLink.svelte';
    import ProfileLink from '$lib/core/widgets/ProfileLink.svelte';

    import {wait} from '$lib/core/helper/function';
    import {postProject, deleteProject} from '../api/project/project';
    import type {Project} from '../api/project/project';

    let {data} = $props();
    let filter = $state('');
    let projects: Project[] = $state(data.projects);

    let creating = $state(false);
    const filteredProjects = $derived.by(() => {
        if (filter === '') return projects;

        const fuse = new Fuse(projects, {keys: ['name'], shouldSort: false});
        const found = fuse.search(filter);
        return found.map(f => f.item);
    });

    const createProject = async () => {
        creating = true;
        Promise.all([postProject({name: `Untitled project ${projects.length}`}), wait(500)])
            .then(([project]) => {
                return goto(`/project/${project.id}`);
            })
            .then(() => {
                creating = false;
            })
            .catch(() => {
                creating = false;
            });
    };

    const removeProject = async (project: Project) => {
        if (confirm(`Are you sure you want to remove ${project.name}?`)) {
            await deleteProject({id: project.id});
            projects = projects.filter(p => p.id !== project.id);
        }
    };
</script>

<svelte:head>
    <title>Exeflow - Home</title>
</svelte:head>

<Navbar>
    {#snippet left()}
        <Logo />
    {/snippet}
    {#snippet right()}
        <ProfileLink />
        <GithubLink />
    {/snippet}
</Navbar>

<main>
    <div class="toolbar">
        <input type="search" placeholder="Filter projects..." bind:value={filter} />
        <button disabled={creating} onclick={createProject}>New automation project</button>
    </div>
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
                    <button class="icon" onclick={() => removeProject(project)}>
                        <Trash />
                    </button>
                </div>
            </div>
        {/each}
    </div>
</main>

<style>
    main {
        gap: 1rem;
        display: flex;
        overflow: auto;
        flex-grow: 1;
        margin-top: 6rem;
        padding-inline: 3rem;
        flex-direction: column;
    }

    .project {
        & img {
            width: 100%;
            border: 0.15rem solid var(--color-bg-2);
            border-radius: 1rem;

            background-color: var(--color-bg-1);

            transition: border 0.3s;

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
        }
    }

    .toolbar {
        gap: 1rem;
        display: flex;
    }

    .projects {
        display: grid;
        grid-gap: 2rem;
        overflow: auto;
        flex-grow: 1;
        padding-right: 1rem;
        align-content: start;
        grid-template-columns: repeat(auto-fill, minmax(clamp(15rem, 25vw, 25rem), 1fr));
    }
</style>
