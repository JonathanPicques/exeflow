<script lang="ts">
    import {onMount} from 'svelte';

    import Logo from './widgets/Logo.svelte';
    import Navbar from './widgets/Navbar.svelte';

    let showDevUrls = $state(false);

    onMount(() => {
        showDevUrls = location.hostname === 'localhost';
    });
</script>

<svelte:head>
    <title>Exeflow</title>
</svelte:head>

<Navbar>
    {#snippet left()}
        <Logo />
    {/snippet}
    {#snippet right()}
        <a href="https://github.com/JonathanPicques/exeflow">Github</a>
        {#if showDevUrls}
            <a href="http://127.0.0.1:54323" target="_blank">Supabase Studio</a>
            <a href="http://127.0.0.1:54324" target="_blank">Supabase Inbucket</a>
        {/if}
    {/snippet}
</Navbar>

<main>
    <h1>Automations <em>for devs</em><br />made simple</h1>
    <h2>Exeflow is a free and open source project that aims to provide a clean and simple way to connect multiple apps together.</h2>

    <a href="/home" class="button">Get started now!</a>
</main>

<style>
    main {
        gap: 1rem;
        display: flex;
        padding: 1rem;
        flex-grow: 1;
        align-items: center;
        flex-direction: column;
        justify-content: center;

        & {
            h1,
            h2 {
                text-align: center;
            }

            em {
                font-family: var(--flow-font);
            }
        }
    }
</style>
