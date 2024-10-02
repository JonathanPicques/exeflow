<script lang="ts">
    import Logo from '../../widgets/Logo.svelte';
    import Navbar from '../../widgets/Navbar.svelte';

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
        <span>{data.user.email}</span>
        <a href="/auth/logout" data-sveltekit-reload>Logout</a>
    {/snippet}
</Navbar>

<main>
    <div>{data.user.id}</div>
    <div>{data.user.email}</div>
</main>

<style>
    main {
        gap: 1rem;
        display: flex;
        padding: 1rem;
        flex-grow: 1;
        flex-direction: column;
    }
</style>
