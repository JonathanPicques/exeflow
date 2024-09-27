<script lang="ts" module>
    import type {JsonSchema} from '$lib/schema/schema';

    type EditorMention = NodeEditorMention | SecretEditorMention;
    type NodeEditorMention = {type: 'node'; node: PluginNode; key: string; schema: JsonSchema};
    type SecretEditorMention = {type: 'secret'; key: string};

    type EditorNode = DocEditorNode | TextEditorNode | MentionEditorNode | ParagraphEditorNode;
    type DocEditorNode = {type: 'doc'; content: (TextEditorNode | MentionEditorNode | ParagraphEditorNode)[]};
    type TextEditorNode = {type: 'text'; text: string};
    type MentionEditorNode = {type: 'mention'; attrs: {id: string}};
    type ParagraphEditorNode = {type: 'paragraph'; content?: (TextEditorNode | MentionEditorNode)[]};
</script>

<script lang="ts">
    import Fuse from 'fuse.js';
    import tippy from 'tippy.js';
    import Mention from '@tiptap/extension-mention';
    import StarterKit from '@tiptap/starter-kit';
    import {Editor} from '@tiptap/core';
    import {mount, unmount, onMount, onDestroy} from 'svelte';
    import type {Instance} from 'tippy.js';
    import type {Component, ComponentProps} from 'svelte';

    import MentionList from './mentions/MentionList.svelte';

    import {graphContextKey, getGraphContext} from '$lib/core/core';
    import {projectContextKey, getProjectContext} from '$lib/core/core.client.svelte';
    import {parse, nodeInterpolation, secretInterpolation} from '$lib/core/parse';
    import type {PluginNode} from '$lib/core/graph/nodes';
    import type {JsonSchemaString} from '$lib/schema/schema';

    interface Props {
        id: PluginNode['id'];
        value: string;
        schema: JsonSchemaString;
        onchange?: () => void;
    }

    let {id, value = $bindable(), schema, onchange}: Props = $props();

    let editor: Editor | undefined = $state();
    let element: HTMLDivElement | undefined = $state();
    let focused = $state(false);

    const graphContext = getGraphContext();
    const projectContext = getProjectContext();

    const serialize = (editorNode: EditorNode) => {
        let text = '';
        const traverse = (editorNode: EditorNode, index = 0) => {
            switch (editorNode.type) {
                case 'doc':
                    if (!editorNode.content) break;
                    for (let i = 0; i < editorNode.content.length; i++) {
                        traverse(editorNode.content[i], i);
                    }
                    break;
                case 'text':
                    text += editorNode.text;
                    break;
                case 'mention':
                    text += editorNode.attrs.id;
                    break;
                case 'paragraph':
                    if (index > 0) text += `\n`;
                    if (!editorNode.content) break;
                    for (const item of editorNode.content || []) {
                        traverse(item);
                    }
                    break;
            }
        };

        traverse(editorNode);
        return text;
    };
    const deserialize = (value: string) => {
        const doc = {type: 'doc', content: [] as ParagraphEditorNode[]};
        const lines = value.split('\n');

        for (const line of lines) {
            if (line !== '') {
                doc.content.push({
                    type: 'paragraph',
                    content: parse(line).map(item => {
                        switch (item.type) {
                            case 'text':
                                return {type: 'text', text: item.text};
                            case 'node':
                                return {type: 'mention', attrs: {id: nodeInterpolation(item.id, item.key, item.path)}};
                            case 'secret':
                                return {type: 'mention', attrs: {id: secretInterpolation(item.key)}};
                            default:
                                throw new Error(`unreachable`);
                        }
                    }),
                });
            }
        }
        return doc;
    };

    onMount(() => {
        editor = new Editor({
            content: deserialize(value),
            element,
            extensions: [
                StarterKit,
                Mention.configure({
                    suggestion: {
                        items({query}) {
                            const mentions = [
                                ...graphContext.findNodesBefore(id).flatMap(node =>
                                    Object.entries(node.data.data.results).map(([key, schema]) => {
                                        return {type: 'node', node, key, schema} satisfies EditorMention;
                                    }),
                                ),
                                ...projectContext.secrets.map(({key}) => {
                                    return {type: 'secret', key} satisfies EditorMention;
                                }),
                            ].toSorted((a, b) => {
                                return a.type.localeCompare(b.type);
                            });

                            if (query) {
                                const fuse = new Fuse(mentions, {keys: ['key', 'node.data.id']});
                                const found = fuse.search(query, {limit: 5});
                                return found.map(f => f.item);
                            }
                            return mentions.slice(0, 5);
                        },
                        render() {
                            let target: HTMLDivElement;
                            let instance: Instance;
                            let component: typeof MentionList extends Component<infer _, infer Exports> ? Exports : Record<string, any>;
                            const props = $state({mentions: []}) as ComponentProps<typeof MentionList>;
                            const context = new Map();

                            context.set(graphContextKey, graphContext);
                            context.set(projectContextKey, projectContext);
                            return {
                                onExit() {
                                    unmount(component);
                                    instance.destroy();
                                },
                                onStart(params) {
                                    target = document.createElement('div');
                                    instance = tippy(target, {
                                        trigger: 'manual',
                                        content: target,
                                        placement: 'bottom-start',
                                        interactive: true,
                                        showOnCreate: true,
                                        //
                                        appendTo: () => document.body,
                                        getReferenceClientRect: params.clientRect as () => DOMRect,
                                    });
                                    component = mount(MentionList, {props, target, context});

                                    props.select = params.command;
                                    props.mentions = params.items as EditorMention[];
                                },
                                onUpdate(params) {
                                    props.select = params.command;
                                    props.mentions = params.items as EditorMention[];
                                    component.reset();

                                    if (params.clientRect) {
                                        instance.setProps({
                                            getReferenceClientRect: params.clientRect as () => DOMRect,
                                        });
                                    }
                                },
                                onKeyDown(params) {
                                    if (params.event.key === 'Escape') {
                                        instance.hide();
                                        component.hide();
                                        return true;
                                    }
                                    if (params.event.key === ' ' && params.event.ctrlKey) {
                                        instance.show();
                                        component.show();
                                        return true;
                                    }
                                    return component.key(params.event);
                                },
                            };
                        },
                    },
                    renderHTML({node}) {
                        let sub: Function;
                        const span = document.createElement('span');
                        const [result] = parse(node.attrs.id);

                        switch (result.type) {
                            case 'node': {
                                const _node = graphContext.findNode(result.id);
                                const {icon} = graphContext.findPlugin(_node);

                                span.innerHTML = `<img src=${icon} alt="" /><span>${result.key}${result.path ? '.' + result.path : ''}</span>`;
                                span.setAttribute('title', _node.data.id);
                                span.classList.add('node', 'mention');
                                span.addEventListener('click', () => {
                                    const path = prompt('Sub-property to access e.g., address.zipcode, or empty to access the whole value instead', result.path ?? '');

                                    if (path !== null) {
                                        editor!.state.doc.descendants((otherNode, position) => {
                                            if (node === otherNode) {
                                                const tr = editor!.state.tr;

                                                tr.setNodeMarkup(position, node.type, {
                                                    ...node.attrs,
                                                    id: nodeInterpolation(result.id, result.key, path),
                                                });
                                                editor!.view.dispatch(tr);
                                            }
                                        });
                                    }
                                });
                                span.addEventListener('mouseenter', () => {
                                    sub = projectContext.highlightNode(result.id);
                                });
                                span.addEventListener('mouseleave', () => {
                                    sub?.();
                                });
                                break;
                            }
                            case 'secret': {
                                span.innerHTML = `<span>🔒</span><span>${result.key}</span>`;
                                span.classList.add('secret', 'mention');
                                span.addEventListener('click', () => {
                                    const key = prompt('Secret key', result.key ?? '');

                                    if (key !== null) {
                                        editor!.state.doc.descendants((otherNode, position) => {
                                            if (node === otherNode) {
                                                const tr = editor!.state.tr;

                                                tr.setNodeMarkup(position, node.type, {
                                                    ...node.attrs,
                                                    id: secretInterpolation(key),
                                                });
                                                editor!.view.dispatch(tr);
                                            }
                                        });
                                    }
                                });
                                break;
                            }
                        }
                        return span;
                    },
                }),
            ],
            onBlur() {
                focused = false;
                onchange?.();
            },
            onFocus() {
                focused = true;
            },
            onUpdate(props) {
                value = serialize(props.editor.getJSON() as DocEditorNode);
            },
            onTransaction: () => {
                editor = editor; // force re-render so `editor.isActive` works as expected
            },
        });
    });

    $effect(() => {
        if (editor && value !== serialize(editor.getJSON() as DocEditorNode)) {
            editor.commands.setContent(deserialize(value)); // prevent losing the cursor position
        }
    });

    onDestroy(() => {
        editor?.destroy();
    });
</script>

{#if schema.enum}
    <select {onchange} bind:value>
        {#each schema.enum as enumValue, i}
            <option value={enumValue}>
                {schema.enumLabels?.[i] ?? enumValue}
            </option>
        {/each}
    </select>
{:else}
    <div bind:this={element}></div>
{/if}

<style>
    select {
        width: 100%;
        resize: vertical;
    }

    :global(.mention) {
        padding: 0.1rem 0.3rem;

        color: var(--color-mention-fg);
        cursor: pointer;
        border-radius: 0.5rem;
        background-color: var(--color-mention-bg);

        :global(img, span) {
            padding: 0.1rem;
            vertical-align: middle;
        }
    }
</style>
