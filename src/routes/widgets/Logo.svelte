<script lang="ts">
    import logo from './+logo.svg';

    interface Props {
        to?: string;
        flow?: 'vertical' | 'horizontal';
    }

    let {to = '/', flow = 'vertical'}: Props = $props();
</script>

<div class:horizontal={flow === 'horizontal'}>
    <a href={to}>
        <img src={logo} alt="Exeflow logo" />
    </a>
    <span>exeflow</span>
</div>

<style>
    div {
        gap: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;

        &.horizontal {
            flex-direction: column;
        }
    }

    span {
        font-size: 2rem;
    }
</style>
