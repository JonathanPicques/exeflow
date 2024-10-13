<script lang="ts">
    import type {Node} from '@tiptap/pm/model';
    import type {Editor} from '@tiptap/core';

    import {getGraphContext} from '$lib/core/core';
    import {getProjectContext} from '$lib/core/core.client.svelte';
    import {humanPluginName, extractPluginName, nodeInterpolation, secretInterpolation} from '$lib/core/parse';
    import type {parse} from '$lib/core/parse';
    import type {PluginNode} from '$lib/core/graph/nodes';

    interface Props {
        id: PluginNode['id'];
        editor?: Editor;
        mentionNode: Node;
        interpolations: ReturnType<typeof parse>;
    }

    let props: Props = $props();
    let highlight = $state(false);
    let interpolation = $derived(props.interpolations[0]);

    const graphContext = getGraphContext();
    const projectContext = getProjectContext();

    $effect(() => {
        if (highlight && interpolation?.type === 'node') {
            return projectContext.highlightNode(interpolation.id);
        }
    });

    const nodeClick = () => {
        const editor = props.editor;

        if (editor && interpolation.type === 'node') {
            const path = prompt('Sub-property to access e.g., address.zipcode, or empty to access the whole value instead', interpolation.path ?? '');

            if (path !== null) {
                editor.state.doc.descendants((node, position) => {
                    if (node === props.mentionNode) {
                        const tr = editor.state.tr;

                        tr.setNodeMarkup(position, props.mentionNode.type, {
                            ...props.mentionNode.attrs,
                            id: nodeInterpolation(interpolation.id, interpolation.key, path),
                        });
                        editor.view.dispatch(tr);
                    }
                });
            }
        }
    };
    const secretClick = () => {
        const editor = props.editor;

        if (editor && interpolation.type === 'secret') {
            const key = prompt('Secret key', interpolation.key ?? '');

            if (key !== null) {
                editor.state.doc.descendants((node, position) => {
                    if (node === props.mentionNode) {
                        const tr = editor.state.tr;

                        tr.setNodeMarkup(position, props.mentionNode.type, {
                            ...props.mentionNode.attrs,
                            id: secretInterpolation(key),
                        });
                        editor.view.dispatch(tr);
                    }
                });
            }
        }
    };
</script>

{#if interpolation?.type === 'node'}
    {@const node = graphContext.findNode(interpolation.id)}
    {@const plugin = node && graphContext.getPlugin(node)}

    {#if node && plugin}
        {@const show = () => (highlight = true)}
        {@const hide = () => (highlight = false)}
        {@const interpolationText = interpolation.path ? `${interpolation.key}.${interpolation.path}` : interpolation.key}

        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <span
            role="tooltip"
            class="node"
            title="use the result of {interpolationText} provided by the node {humanPluginName(extractPluginName(node.data.id))}"
            onclick={nodeClick}
            onmouseenter={show}
            onmouseleave={hide}
        >
            <img src={plugin.icon} alt="" />
            <span>
                {interpolationText}
            </span>
        </span>
    {:else}
        <span class="node not-found" title="references a node that no longer exist, you can safely erase it with backspace">Not found</span>
    {/if}
{:else if interpolation?.type === 'secret'}
    {@const key = interpolation.key}
    {@const found = projectContext.secrets.findIndex(s => s.key === key) !== -1}
    {@const foundText = `use the value of the secret ${interpolation.key}`}
    {@const notFoundText = `use the value of the secret ${interpolation.key} (this secret does not exist)`}

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <span role="tooltip" class="secret" title={found ? foundText : notFoundText} class:not-found={!found} onclick={secretClick}>
        <span>🔒</span>
        <span>{interpolation.key}</span>
    </span>
{/if}

<style>
    .node {
        padding: 0.1rem 0.3rem;

        color: var(--color-mention-fg);
        cursor: pointer;
        border-radius: 0.5rem;
        background-color: var(--color-mention-bg);

        img {
            padding-bottom: 0.15rem;
            vertical-align: middle;
        }

        &.not-found {
            color: var(--color-fg);
            background-color: var(--color-error);
        }
    }

    .secret {
        padding: 0.1rem 0.3rem;

        color: var(--color-mention-fg);
        cursor: pointer;
        border-radius: 0.5rem;
        background-color: var(--color-mention-bg);

        &.not-found {
            color: var(--color-fg);
            background-color: var(--color-error);
        }
    }
</style>
