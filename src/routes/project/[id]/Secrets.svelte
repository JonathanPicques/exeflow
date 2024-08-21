<script lang="ts">
    import {putSecret, getSecrets, deleteSecret} from '../../api/secrets/secrets';
    import type {Secret} from '../../api/secrets/secrets';

    let secret = $state({key: '', value: ''});
    let secrets: Secret[] = $state([]);

    $effect.pre(() => {
        getSecrets().then(s => {
            secrets = s;
        });
    });

    const add = async () => {
        await putSecret(secret);
        secrets = secrets.filter(s => s.key !== secret.key);
        secrets.push(secret);
        secret = {key: '', value: ''};
    };

    const remove = async (key: string) => {
        await deleteSecret({key});
        secrets = secrets.filter(s => s.key !== key);
    };
</script>

{#each secrets as secret}
    <div>
        <input type="text" value={secret.key} />
        <input type="text" value={secret.value} />
        <button onclick={() => remove(secret.key)}>🗑</button>
    </div>
{/each}

<div>
    <input type="text" bind:value={secret.key} />
    <input type="text" bind:value={secret.value} />
    <button onclick={add}>Add</button>
</div>
