<script lang="ts">
    import logo from './+logo.svg';

    interface Props {
        to?: string;
        flow?: 'vertical' | 'horizontal';
        imgSize?: string;
        textSize?: string;
    }

    let {to = '/', flow = 'vertical', imgSize = '2rem', textSize = '1.5rem'}: Props = $props();
</script>

<div class:horizontal={flow === 'horizontal'} style:--img-size={imgSize} style:--text-size={textSize}>
    <a href={to}>
        <img src={logo} alt="Exeflow logo" />
    </a>
    <span>exeflow</span>
</div>

<style>
    a {
        display: flex;
    }

    div {
        gap: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;

        &.horizontal {
            flex-direction: column;
        }
    }

    img {
        width: var(--img-size, 2rem);
    }

    span {
        font-size: var(--text-size, 1.5rem);
    }
</style>
