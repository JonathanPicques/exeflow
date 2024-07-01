<script lang="ts">
    import {fetchMe} from './api/me/me.api';
</script>

<nav>
    {#await fetchMe()}
        <div style:visibility="hidden">
            <span>Loading</span>
        </div>
    {:then me}
        {#if me}
            <div style:flex-grow="1">
                <a href="/home">Projects</a>
            </div>
            <div>
                <span>{me.email}</span>
                <a href="/auth/logout" data-sveltekit-reload>Logout</a>
            </div>
        {:else}
            <div style:flex-grow="1">
                <span>Exeflow</span>
            </div>
            <div>
                <a href="/auth/login">Login</a>
                <a href="/auth/register">Register</a>
            </div>
        {/if}
    {/await}
</nav>

<main>
    <h1>Landing page</h1>

    <a href="http://127.0.0.1:54323" target="_blank">Supabase Studio</a>
    <a href="http://127.0.0.1:54324" target="_blank">Supabase Inbucket</a>
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
