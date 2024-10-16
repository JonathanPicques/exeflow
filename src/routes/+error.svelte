<script>
    import {page} from '$app/stores';

    import Bg from './widgets/Bg.svelte';
    import Logo from './widgets/Logo.svelte';
    import Navbar from './widgets/Navbar.svelte';
    import GithubLink from './widgets/GithubLink.svelte';
</script>

<Bg />
<Navbar>
    {#snippet left()}
        <Logo />
    {/snippet}
    {#snippet right()}
        <GithubLink />
    {/snippet}
</Navbar>

<main>
    <h1>{$page.status}</h1>
    <div>{$page.error?.message ?? 'an error occured'}</div>
</main>

<style>
    main {
        display: flex;
        flex-grow: 1;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }
</style>
