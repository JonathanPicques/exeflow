<script lang="ts">
    let {data} = $props();
</script>

<svelte:head>
    <title>Exeflow - Profile</title>
</svelte:head>

<nav>
    <div style:flex-grow="1">
        <a href="/home">Home</a>
    </div>
    <div>
        <span>{data.user.email}</span> - <a href="/auth/logout" data-sveltekit-reload>Logout</a>
    </div>
</nav>

<main>
    <div>{data.user.id}</div>
    <div>{data.user.email}</div>
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
        flex-grow: 1;
        flex-direction: column;
    }
</style>
