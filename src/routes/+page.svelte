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

<Navbar fixed={true}>
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
    <h2>Exeflow is a free and open source project that aims to<wbr /> provide a clean and simple way to connect multiple<wbr /> apps together.</h2>

    <a href="/home" class="button">Get started now!</a>
</main>

<style>
    main {
        gap: 2rem;
        display: flex;
        padding: 1rem;
        flex-grow: 1;
        max-width: 60rem;
        align-items: center;
        margin-inline: auto;
        flex-direction: column;
        justify-content: center;

        & {
            h1 {
                font-size: clamp(3rem, 8vw, 4rem);
                text-align: center;
                font-weight: normal;
                line-height: 110%;
                letter-spacing: -2px;
            }
            h2 {
                color: var(--color-fg-1);
                font-size: clamp(1.4rem, 2vw, 1.6rem);
                text-wrap: balance;
                text-align: center;
                font-weight: normal;
                line-height: 140%;
                margin-bottom: 1rem;
            }
            em {
                color: var(--color-primary);
                font-family: var(--font-mono);
            }
        }
    }
</style>
