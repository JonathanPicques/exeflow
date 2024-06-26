<script lang="ts">
    import {fetchMe} from './api/me/me.api';
</script>

<nav>
    {#await fetchMe()}
        <!-- Loading state -->
    {:then me}
        {#if me}
            <span>Hello {me.email}</span>
            <ul>
                <li><a href="/home">Projects</a></li>
                <li><a href="/auth/logout" data-sveltekit-reload>Logout</a></li>
            </ul>
        {:else}
            <ul>
                <li><a href="/auth/login">Login</a></li>
                <li><a href="/auth/register">Register</a></li>
            </ul>
        {/if}
    {/await}
</nav>
<main>
    <h1>Landing page</h1>
    <ul>
        <li><a href="http://127.0.0.1:54323" target="_blank">Supabase Studio</a></li>
        <li><a href="http://127.0.0.1:54324" target="_blank">Supabase Inbucket</a></li>
    </ul>
</main>
