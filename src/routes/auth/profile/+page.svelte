<script lang="ts">
    import Logo from '../../widgets/Logo.svelte';
    import Navbar from '../../widgets/Navbar.svelte';
    import GithubLink from '../../widgets/GithubLink.svelte';

    let {data} = $props();
</script>

<svelte:head>
    <title>Exeflow - Profile</title>
</svelte:head>

<Navbar>
    {#snippet left()}
        <Logo to="/home" />
    {/snippet}
    {#snippet right()}
        <GithubLink />
    {/snippet}
</Navbar>

<main>
    <div>
        {data.user.email} - <a href="/auth/logout" data-sveltekit-reload>Logout</a>
    </div>
</main>

<style>
    main {
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
    }
</style>
