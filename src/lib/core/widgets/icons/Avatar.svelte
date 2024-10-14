<script lang="ts">
    interface Props {
        fill?: string;
        size?: string;
    }

    let {fill, size}: Props = $props();
</script>

<svg viewBox="0 0 16 16" style:--fill={fill} style:--size={size}>
    <path
        d="m 8 1 c -1.65625 0 -3 1.34375 -3 3 s 1.34375 3 3 3 s 3 -1.34375 3 -3 s -1.34375 -3 -3 -3 z m -1.5 7 c -2.492188 0 -4.5 2.007812 -4.5 4.5 v 0.5 c 0 1.109375 0.890625 2 2 2 h 8 c 1.109375 0 2 -0.890625 2 -2 v -0.5 c 0 -2.492188 -2.007812 -4.5 -4.5 -4.5 z m 0 0"
    />
</svg>

<style>
    svg {
        fill: var(--fill, currentColor);
        width: var(--size, 1.5rem);
        height: var(--size, 1.5rem);
    }
</style>
