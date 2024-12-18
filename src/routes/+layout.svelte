<script lang="ts">
    import {fade} from 'svelte/transition';
    import {navigating} from '$app/state';
    import {onNavigate} from '$app/navigation';

    import '../app.css';

    let loader = $state(false);
    let {children} = $props();

    $effect(() => {
        if (navigating.to !== null) {
            const timeout = setTimeout(() => {
                loader = true;
            }, 500);
            return () => {
                clearTimeout(timeout);
            };
        } else {
            loader = false;
        }
    });

    onNavigate(navigation => {
        if (!document.startViewTransition) return;

        return new Promise(resolve => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            });
        });
    });
</script>

{@render children()}
{#if loader}
    <div class="loader" transition:fade={{duration: 300}}></div>
{/if}

<style>
    .loader {
        left: 0;
        right: 0;
        bottom: 0;
        height: 0.5rem;
        position: fixed;

        background: linear-gradient(90deg, #0001 33%, #0005 50%, #0001 66%) var(--color-primary-1);
        background-size: 300% 100%;

        animation: loader 1s infinite linear;
    }

    @keyframes loader {
        0% {
            background-position: right;
        }
    }
</style>
