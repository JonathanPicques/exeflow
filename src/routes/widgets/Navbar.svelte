<script lang="ts">
    import type {Snippet} from 'svelte';

    interface Props {
        left?: Snippet;
        center?: Snippet;
        right?: Snippet;
        fixed?: boolean;
    }

    let {left, center, right, fixed = false}: Props = $props();
</script>

<nav class:fixed>
    {#if left}
        <div>
            {@render left()}
        </div>
    {/if}
    <div class="center">
        {@render center?.()}
    </div>
    {#if right}
        <div>
            {@render right()}
        </div>
    {/if}
</nav>

<style>
    nav {
        gap: 1rem;
        height: 5rem;
        display: flex;
        padding: 1rem;
        background-image: linear-gradient(var(--color-bg), transparent);

        & > div {
            gap: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        & > div.center {
            flex-grow: 1;
        }
    }

    nav.fixed {
        top: 0;
        left: 0;
        right: 0;
        position: fixed;
    }
</style>
