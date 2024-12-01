<script lang="ts">
    import Logo from '$lib/core/widgets/Logo.svelte';
    import Navbar from '$lib/core/widgets/Navbar.svelte';
    import GithubLink from '$lib/core/widgets/GithubLink.svelte';

    let {data} = $props();
</script>

<svelte:head>
    <title>Exeflow - Confirm account</title>
</svelte:head>

<Navbar>
    {#snippet left()}
        <Logo />
    {/snippet}
    {#snippet right()}
        <GithubLink />
    {/snippet}
</Navbar>

<main>
    {#if data.error}
        <h1>There was an error while confirming your account</h1>
        <p class="error">{data.error.message}</p>
    {:else}
        <h1>Account confirmed!</h1>
        <a href="/home">Start automating!</a>
    {/if}
</main>

<style>
    main {
        gap: 1rem;
        display: flex;
        flex-grow: 1;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }

    .error {
        color: var(--color-error);
    }
</style>
