<script lang="ts">
    import {getProjectContext} from '$lib/core/core.client.svelte';

    let secret = $state({key: '', value: ''});

    const {secrets, putSecret, deleteSecret} = getProjectContext();
</script>

{#each secrets as secret}
    <div>
        <input type="text" value={secret.key} />
        <input type="text" value={secret.value} />
        <button onclick={() => deleteSecret(secret.key)}>🗑</button>
    </div>
{/each}

<div>
    <input type="text" bind:value={secret.key} />
    <input type="text" bind:value={secret.value} />
    <button onclick={() => putSecret(secret)}>Add</button>
</div>
