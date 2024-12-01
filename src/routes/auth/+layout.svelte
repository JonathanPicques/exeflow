<script lang="ts">
    import Bg from '$lib/core/widgets/Bg.svelte';

    let {children} = $props();
</script>

<Bg />
{@render children()}
