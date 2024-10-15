<script lang="ts">
    import Add from '$lib/core/widgets/icons/Add.svelte';
    import Trash from '$lib/core/widgets/icons/Trash.svelte';

    import {getProjectContext} from '$lib/core/core.client.svelte';

    let secret = $state({key: '', value: ''});

    const projectContext = getProjectContext();

    const putSecret = () => {
        projectContext.putSecret(secret);
        secret.key = '';
        secret.value = '';
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
                <input type="text" class="key" value={secret.key} />
                <input type="text" class="value" value={secret.value} />
                <button class="icon" onclick={() => projectContext.deleteSecret(secret.key)}>
                    <Trash />
                </button>
            </div>
        {/each}
        <div class="secret">
            <input type="text" class="key" placeholder="Secret key" bind:value={secret.key} />
            <input type="text" class="value" placeholder="Secret value" bind:value={secret.value} />
            <button class="icon" onclick={putSecret}>
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

        input {
            width: 40%;
            min-width: 100px;
        }

        & .secret {
            gap: 0.5rem;
            display: flex;
            align-items: center;
        }
    }
</style>
