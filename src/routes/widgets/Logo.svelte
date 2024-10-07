<script lang="ts">
    interface Props {
        to?: string;
        flow?: 'vertical' | 'horizontal';
        imgSize?: string;
        textSize?: string;
    }

    let {to = '/', flow = 'vertical', imgSize, textSize}: Props = $props();
</script>

<div class:horizontal={flow === 'horizontal'} style:--img-size={imgSize} style:--text-size={textSize}>
    <a href={to} aria-label="Exeflow logo">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="42" height="42" rx="15" fill="url(#gradient)" />
            <path d="M19.416 33.2001L27.06 9.80005H30.336L22.692 33.2001H19.416Z" fill="#2D2D2D" />
            <path
                d="M15.9619 28.3641C15.2685 28.3641 14.6792 28.1387 14.1939 27.6881C13.7259 27.2201 13.4919 26.6221 13.4919 25.8941C13.4919 25.1661 13.7259 24.5767 14.1939 24.1261C14.6792 23.6581 15.2685 23.4241 15.9619 23.4241C16.6725 23.4241 17.2619 23.6581 17.7299 24.1261C18.1979 24.5767 18.4319 25.1661 18.4319 25.8941C18.4319 26.6221 18.1979 27.2201 17.7299 27.6881C17.2619 28.1387 16.6725 28.3641 15.9619 28.3641Z"
                fill="#2D2D2D"
            />
            <defs>
                <linearGradient id="gradient" x1="21" y1="0" x2="21" y2="42" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#0BDAC1" />
                    <stop offset="1" stop-color="#31FF9C" />
                </linearGradient>
            </defs>
        </svg>
    </a>
    <span>exeflow</span>
</div>

<style>
    a {
        display: flex;
    }

    div {
        gap: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;

        &.horizontal {
            flex-direction: column;
        }
    }

    svg {
        width: var(--img-size, 2rem);
        height: var(--img-size, 2rem);
    }

    span {
        font-size: var(--text-size, 1.5rem);
        font-weight: normal;
    }
</style>
