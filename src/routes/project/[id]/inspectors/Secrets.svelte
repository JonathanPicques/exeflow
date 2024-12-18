<script lang="ts">
    import Add from '$lib/core/widgets/icons/Add.svelte';
    import Trash from '$lib/core/widgets/icons/Trash.svelte';

    import {wait} from '$lib/core/helper/function';
    import {getProjectContext} from '$lib/core/core.client.svelte';

    import {putSecret, deleteSecret} from '../../../api/secrets/secrets';

    let secret = $state({key: '', value: ''});

    const projectContext = getProjectContext();
    const validSecretName = $derived(secret.key !== '' && !projectContext.secrets.map(s => s.key).includes(secret.key));

    const newSecret = () => {
        putSecret(secret).then(newSecret => projectContext.putSecret(newSecret));
        secret.key = '';
        secret.value = '';
    };
    const editSecret = (key: string, e: FocusEvent & {currentTarget: EventTarget & HTMLInputElement}) => {
        const target = e.currentTarget;
        target.setAttribute('disabled', 'true');
        Promise.all([
            //
            wait(500),
            putSecret({key, value: target.value}).then(newSecret => projectContext.putSecret(newSecret)),
        ]).then(() => target.removeAttribute('disabled'));
    };
    const removeSecret = (secretKey: string) => {
        if (confirm(`Are you sure you want to delete the secret ${secretKey}?\nAll usages of ${secretKey} might result in errors\nThis action cannot be undone`)) {
            deleteSecret({key: secretKey}).then(() => projectContext.deleteSecret(secretKey));
        }
    };
</script>

<div class="main">
    <div>
        Reusable values that are shared among your projects.<br />
    </div>
    <div>
        Type <span>@</span> followed by the secret key to reuse the value in any node text input.
    </div>

    <div class="secrets">
        {#each projectContext.secrets as secret}
            <div class="secret">
                <span>{secret.key}</span>
                <input type="text" class="value" value={secret.value} onblur={e => editSecret(secret.key, e)} />
                <button class="icon" onclick={() => removeSecret(secret.key)}>
                    <Trash />
                </button>
            </div>
        {/each}
        <div class="secret">
            <input type="text" class="key" placeholder="Secret key" bind:value={secret.key} />
            <input type="text" class="value" placeholder="Secret value" bind:value={secret.value} />
            <button class="icon" onclick={newSecret} disabled={!validSecretName}>
                <Add />
            </button>
        </div>
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

    .secrets {
        gap: 1rem;
        display: flex;
        overflow-y: auto;
        flex-direction: column;

        span,
        input {
            width: 40%;
            overflow: hidden;
            min-width: 100px;
            text-overflow: ellipsis;
        }

        & .secret {
            gap: 0.5rem;
            display: flex;
            align-items: center;
        }
    }
</style>
