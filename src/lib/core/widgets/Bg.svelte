<svg width="100%" height="100%">
    <pattern patternUnits="userSpaceOnUse" id="exeflow-background-pattern" x="0" y="0" width="20" height="20" patternTransform="translate(-0.5,-0.5)">
        <circle cx="0.5" cy="0.5" r="0.5"></circle>
    </pattern>
    <rect x="0" y="0" width="100%" height="100%" fill="url(#exeflow-background-pattern)"></rect>
</svg>

<style>
    svg {
        z-index: -1;
        position: fixed;
        pointer-events: none;
    }

    circle {
        fill: var(--flow-color-grid-dots);
    }
</style>
