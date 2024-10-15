<script lang="ts">
    interface Props {
        size?: string;
        color?: string;
    }

    let {size = '1.5rem', color = 'currentColor'}: Props = $props();
</script>

<svg viewBox="0 0 16 18" style:--size={size} style:--color={color}>
    <rect y="2.57141" width="15.4286" height="2.66666" rx="1.33333" />
    <rect x="5.14283" width="5.14285" height="5.14285" rx="2" />
    <path
        d="M2.6587 7.50913C2.61166 6.92698 3.07141 6.42858 3.65545 6.42858H11.773C12.3571 6.42858 12.8168 6.92698 12.7698 7.50913L12.0706 16.1611C11.9867 17.1998 11.1192 18 10.0771 18H5.35135C4.30924 18 3.44178 17.1998 3.35785 16.1611L2.6587 7.50913Z"
    />
</svg>

<style>
    svg {
        width: var(--size, 1.5rem);
        height: var(--size, 1.5rem);

        fill: var(--color, currentColor);
        stroke: var(--color, currentColor);
    }
</style>
