<script lang="ts">
    export let data;
</script>

<main>
    {#if data.user.type === 'anon'}
        <div>
            <span>Anon #{data.user.id}</span>
            <a href="/auth/register">Save your work by creating an account!</a>
        </div>
    {/if}
    {#if data.user.type === 'user'}
        <div>
            <span>{data.user.email}</span>
            <a href="/auth/logout">Logout</a>
        </div>
    {/if}

    <h1>My projects</h1>
    <div>
        {#each data.projects as { id, name }}
            <div>
                <a href="/project/{id}">{name}</a>
            </div>
        {/each}
    </div>
</main>
