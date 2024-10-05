declare module 'svelte' {
    import type {Component} from 'svelte';

    /**
     * Helper to type to extract the type of a bound/mounted component with exported fields and methods exposed
     * @example
     * ```ts
     * import Component from './Component.svelte';
     * let component: MountedComponent<typeof Component>;
     * $effect(() => component.someExportedFunction()); // type-safe component ✨
     * // ...
     * ```
     * ```svelte
     * <Component bind:this={component} />
     * ```
     */
    export type MountedComponent<T extends Component<any>> = ReturnType<T>;
}
