<script lang="ts">
    import Add from '$lib/core/widgets/icons/Add.svelte';
    import Trash from '$lib/core/widgets/icons/Trash.svelte';

    import {wait} from '$lib/helper/function';
    import {getProjectContext} from '$lib/core/core.client.svelte';

    let secret = $state({key: '', value: ''});

    const projectContext = getProjectContext();
    const validSecretName = $derived(secret.key !== '' && !projectContext.secrets.map(s => s.key).includes(secret.key));

    const putSecret = () => {
        projectContext.putSecret(secret);
        secret.key = '';
        secret.value = '';
    };
    const editSecret = (key: string, e: FocusEvent & {currentTarget: EventTarget & HTMLInputElement}) => {
        const target = e.currentTarget;
        target.setAttribute('disabled', 'true');
        Promise.all([
            projectContext.putSecret({
                key,
                value: target.value,
            }),
            wait(500),
        ]).then(() => target.removeAttribute('disabled'));
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
                <button class="icon" onclick={() => projectContext.deleteSecret(secret.key)}>
                    <Trash />
                </button>
            </div>
        {/each}
        <div class="secret">
            <input type="text" class="key" placeholder="Secret key" bind:value={secret.key} />
            <input type="text" class="value" placeholder="Secret value" bind:value={secret.value} />
            <button class="icon" onclick={putSecret} disabled={!validSecretName}>
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
