<script lang="ts">
    interface Props {
        fill?: string;
        size?: string;
    }

    let {fill, size}: Props = $props();
</script>

<svg viewBox="0 0 20 20" style:--fill={fill} style:--size={size}>
    <path
        d="M0 5C0 2.23858 2.23858 0 5 0H15C17.7614 0 20 2.23858 20 5V15C20 17.7614 17.7614 20 15 20H5C2.23858 20 0 17.7614 0 15V5ZM9.00002 5.00001C9.00002 4.44772 9.44773 4.00001 10 4.00001C10.5523 4.00001 11 4.44773 11 5.00001V8.99998H15C15.5523 8.99998 16 9.44769 16 9.99998C16 10.5523 15.5523 11 15 11H11V15C11 15.5523 10.5523 16 10 16C9.44773 16 9.00002 15.5523 9.00002 15V11H5.00002C4.44774 11 4.00002 10.5523 4.00002 9.99998C4.00002 9.44769 4.44774 8.99998 5.00002 8.99998H9.00002V5.00001Z"
        fill-rule="evenodd"
        clip-rule="evenodd"
    />
</svg>

<style>
    svg {
        fill: var(--fill, currentColor);
        width: var(--size, 1.5rem);
        height: var(--size, 1.5rem);
    }
</style>
