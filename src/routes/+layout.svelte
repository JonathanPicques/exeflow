<script lang="ts">
    import '../app.css';
    import {navigating} from '$app/stores';

    let loader = $state(false);
    let {children} = $props();

    $effect(() => {
        if ($navigating) {
            const timeout = setTimeout(() => {
                loader = true;
            }, 500);
            return () => {
                loader = false;
                clearTimeout(timeout);
            };
        } else {
            loader = false;
        }
    });
</script>

{@render children()}
{#if loader}
    <div class="loader"></div>
{/if}

<style>
    .loader {
        left: 0;
        right: 0;
        bottom: 0;
        height: 0.5rem;
        position: fixed;

        background: linear-gradient(90deg, #0001 33%, #0005 50%, #0001 66%) var(--color-bg-2);
        background-size: 300% 100%;

        animation: loader 1s infinite linear;
    }

    @keyframes loader {
        0% {
            background-position: right;
        }
    }
</style>
