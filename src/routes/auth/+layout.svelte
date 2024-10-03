<script lang="ts">
    import Bg from '../widgets/Bg.svelte';

    let {children} = $props();
</script>

<Bg />
{@render children()}
