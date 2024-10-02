<script lang="ts">
    import {onMount} from 'svelte';

    let showDevUrls = $state(false);

    onMount(() => {
        showDevUrls = location.hostname === 'localhost';
    });
</script>

<svelte:head>
    <title>Exeflow</title>
</svelte:head>

<nav>
    <div>Exeflow</div>
    <div style:flex-grow="1"></div>
    <div>
        <a href="https://github.com/JonathanPicques/exeflow">Github</a>
        {#if showDevUrls}
            <a href="http://127.0.0.1:54323" target="_blank">Supabase Studio</a>
            <a href="http://127.0.0.1:54324" target="_blank">Supabase Inbucket</a>
        {/if}
    </div>
</nav>

<main>
    <h1>Automations for devs made simple</h1>
    <h2>Exeflow is a free and open source project that aims to provide a clean and simple way to connect multiple apps together.</h2>

    <a href="/home">Get started now!</a>
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
        flex-direction: column;
    }
</style>
