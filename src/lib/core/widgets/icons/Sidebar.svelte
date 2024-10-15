<script lang="ts">
    interface Props {
        size?: string;
        color?: string;
    }

    let {size = '1.5rem', color = 'currentColor'}: Props = $props();
</script>

<svg viewBox="0 0 22 24" style:--size={size} style:--color={color}>
    <rect x="1" y="1" width="20" height="22" rx="3" fill="transparent" stroke-width="2" />
    <rect x="12" y="1" width="9" height="22" rx="3" stroke-width="2" />
</svg>

<style>
    svg {
        width: var(--size, 1.5rem);
        height: var(--size, 1.5rem);

        fill: var(--color, currentColor);
        stroke: var(--color, currentColor);
    }
</style>
