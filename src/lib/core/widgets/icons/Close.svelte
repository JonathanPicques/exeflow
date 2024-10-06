<script lang="ts">
    interface Props {
        fill?: string;
        size?: string;
    }

    let {fill, size}: Props = $props();
</script>

<svg viewBox="0 0 22 22" style:--fill={fill} style:--size={size}>
    <g>
        <rect x="4" y="15.6" width="17.8191" height="1.9799" rx="0.989948" transform="translate(0 1) rotate(-45 4 15.6)" />
    </g>
    <g>
        <rect x="16.6" y="17" width="17.8191" height="1.9799" rx="0.989948" transform="translate(0 1) rotate(-135 16.6 17)" />
    </g>
</svg>

<style>
    svg {
        fill: var(--fill, currentColor);
        width: var(--size, 24px);
        height: var(--size, 24px);
    }
</style>
