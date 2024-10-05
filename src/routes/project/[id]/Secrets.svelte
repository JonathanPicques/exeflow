<script lang="ts">
    import {getProjectContext} from '$lib/core/core.client.svelte';

    let secret = $state({key: '', value: ''});

    const {secrets, putSecret, deleteSecret} = getProjectContext();
</script>

<div class="main">
    <h1>Your Secrets</h1>
    <p>
        Reusable values that are shared among your projects.<br />
        Type <span>@</span> followed by the secret key to use in any node text input.
    </p>

    {#each secrets as secret}
        <div class="group">
            <input type="text" class="key" value={secret.key} />
            <input type="text" class="value" value={secret.value} />
            <button class="icon" onclick={() => deleteSecret(secret.key)}>🗑</button>
        </div>
    {/each}
    <div class="group">
        <input type="text" class="key" placeholder="Secret key" bind:value={secret.key} />
        <input type="text" class="value" placeholder="Secret value" bind:value={secret.value} />
        <button class="icon" onclick={() => putSecret(secret)}>➕</button>
    </div>
</div>

<style>
    .main {
        gap: 1rem;
        height: 100%;
        padding: 1rem;
        display: flex;
        overflow: hidden;
        flex-direction: column;
    }

    .value {
        flex-grow: 1;
    }

    .group {
        gap: 0.5rem;
        display: flex;
        align-items: center;
    }
</style>
