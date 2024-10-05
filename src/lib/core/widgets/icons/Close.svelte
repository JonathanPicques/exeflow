<script lang="ts">
    interface Props {
        fill?: string;
        size?: string;
    }

    let {fill, size}: Props = $props();
</script>

<svg viewBox="0 0 22 22" style:--fill={fill} style:--size={size}>
    <g>
        <rect x="4" y="15.728" width="18" height="2" rx="1" transform="rotate(-45 4 15.728)" />
    </g>
    <g>
        <rect x="16.7279" y="17.1422" width="18" height="2" rx="1" transform="rotate(-135 16.7279 17.1422)" />
    </g>
</svg>

<style>
    svg {
        fill: var(--fill, currentColor);
        width: var(--size, 24px);
        height: var(--size, 24px);
    }
</style>
