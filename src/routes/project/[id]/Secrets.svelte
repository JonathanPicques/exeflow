<script lang="ts">
    import {deleteSecret, getSecrets, putSecret} from '../../api/secrets/secrets';

    let newKey = $state('');
    let newValue = $state('');
    let secrets = $state(getSecrets());

    const add = async () => {
        if (!newKey || !newValue) return;

        const secret = await putSecret({key: newKey, value: newValue});

        if (secret) {
            newKey = '';
            newValue = '';
            secrets = getSecrets();
        }
    };

    const remove = async (key: string) => {
        await deleteSecret({key});
        secrets = getSecrets();
    };
</script>

{#await secrets then secrets}
    {#each secrets as secret}
        <div>
            <input type="text" value={secret.key} />
            <input type="text" value={secret.value} />
            <button onclick={() => remove(secret.key)}>🗑</button>
        </div>
    {/each}
{/await}

<div>
    <input type="text" bind:value={newKey} />
    <input type="text" bind:value={newValue} />
    <button onclick={add}>Add</button>
</div>
