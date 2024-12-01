<script lang="ts">
    import Bg from '$lib/core/widgets/Bg.svelte';
    import Logo from '$lib/core/widgets/Logo.svelte';
    import Navbar from '$lib/core/widgets/Navbar.svelte';
    import GithubLink from '$lib/core/widgets/GithubLink.svelte';
</script>

<svelte:head>
    <title>Exeflow</title>
</svelte:head>

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
    <h1>Automations <span>for devs</span><br />made simple</h1>
    <h2>Exeflow is a free and open source project that aims to<wbr /> provide a clean and simple way to connect multiple<wbr /> apps together.</h2>

    <a href="/home" role="button" class="button">Get started now!</a>

    <!-- <a href="http://127.0.0.1:54323" target="_blank">Supabase Studio</a> -->
    <!-- <a href="http://127.0.0.1:54324" target="_blank">Supabase Inbucket</a> -->
</main>

<style>
    main {
        gap: 2rem;
        height: 100%;
        display: flex;
        padding: 1rem;
        flex-grow: 1;
        max-width: 60rem;
        align-items: center;
        margin-inline: auto;
        flex-direction: column;
        justify-content: center;
    }

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

    span {
        color: var(--color-primary);
    }

    .button {
        font-size: 1.8rem;
        border-radius: 2rem;

        color: #333333;
        box-shadow: 0 0 1.5rem hsl(151, 100%, 60%, 0.2);
        background-image: linear-gradient(to bottom, #0bdac1, #31ff9c);

        transition: 0.5s box-shadow;

        &:hover {
            box-shadow: 0 0 2rem hsl(151, 100%, 60%, 0.4);
        }
    }
</style>
