<script lang="ts">
    interface Props {
        size?: string;
        color?: string;
    }

    let {size = '1.5rem', color = 'currentColor'}: Props = $props();
</script>

<svg viewBox="0 0 20 20" style:--size={size} style:--color={color}>
    <rect y="2.82837" width="4" height="24" rx="2" transform="rotate(-45 0 2.82837)" />
    <rect x="2.82837" y="19.799" width="4" height="24" rx="2" transform="rotate(-135 2.82837 19.799)" />
</svg>

<style>
    svg {
        width: var(--size, 1.5rem);
        height: var(--size, 1.5rem);

        fill: var(--color, currentColor);
        stroke: var(--color, currentColor);
    }
</style>
