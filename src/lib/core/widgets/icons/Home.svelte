<script lang="ts">
    interface Props {
        fill?: string;
        size?: string;
    }

    let {fill, size}: Props = $props();
</script>

<svg viewBox="0 0 18 20" style:--fill={fill} style:--size={size}>
    <path
        d="M0 10.3319V18C0 19.1046 0.89543 20 2 20H5C5.55228 20 6 19.5523 6 19V14.125C6 13.5727 6.44772 13.125 7 13.125H11C11.5523 13.125 12 13.5727 12 14.125V19C12 19.5523 12.4477 20 13 20H16C17.1046 20 18 19.1046 18 18V10.3319C18 9.24154 17.5549 8.19841 16.7676 7.44397L10.3838 1.32615C9.61021 0.584787 8.38979 0.584788 7.61619 1.32615L1.23238 7.44397C0.445134 8.19841 0 9.24154 0 10.3319Z"
    />
</svg>

<style>
    svg {
        fill: var(--fill, currentColor);
        width: var(--size, 1.5rem);
        height: var(--size, 1.5rem);
    }
</style>
