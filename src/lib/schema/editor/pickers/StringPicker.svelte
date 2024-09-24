<script lang="ts" module>
    import type {JsonSchema} from '$lib/schema/schema';

    type EditorMention = NodeEditorMention;
    type NodeEditorMention = {type: 'node'; node: PluginNode; name: string; schema: JsonSchema};

    type EditorNode = DocEditorNode | TextEditorNode | MentionEditorNode | ParagraphEditorNode;
    type DocEditorNode = {type: 'doc'; content: (TextEditorNode | MentionEditorNode | ParagraphEditorNode)[]};
    type TextEditorNode = {type: 'text'; text: string};
    type MentionEditorNode = {type: 'mention'; attrs: {id: string}};
    type ParagraphEditorNode = {type: 'paragraph'; content?: (TextEditorNode | MentionEditorNode)[]};
</script>

<script lang="ts">
    import tippy from 'tippy.js';
    import Mention from '@tiptap/extension-mention';
    import StarterKit from '@tiptap/starter-kit';
    import {Editor} from '@tiptap/core';
    import {mount, unmount, onMount, onDestroy} from 'svelte';
    import type {Instance} from 'tippy.js';
    import type {ComponentProps} from 'svelte';

    import MentionList from './mentions/MentionList.svelte';

    import {parse} from '$lib/helper/parse';
    import {getGraphContext} from '$lib/core/core';
    import {projectContextKey, getProjectContext} from '$lib/core/core.client.svelte';
    import type {PluginNode} from '$lib/core/graph/nodes';
    import type {JsonSchemaString} from '$lib/schema/schema';

    interface Props {
        id: string;
        value: string;
        schema: JsonSchemaString;
        onchange?: () => void;
    }

    let {value = $bindable(), schema, onchange}: Props = $props();

    let editor: Editor | undefined = $state();
    let element: HTMLDivElement | undefined = $state();
    let focused = $state(false);

    const {nodes} = getGraphContext();
    const projectContext = getProjectContext();

    const serialize = (editorNode: EditorNode) => {
        let text = '';
        const traverse = (editorNode: EditorNode, index = 0) => {
            switch (editorNode.type) {
                case 'doc':
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
                                return {type: 'mention', attrs: {id: item.path ? `\${node:${item.id}:${item.property}:${item.path}}` : `\${node:${item.id}:${item.property}}`}};
                            case 'secret':
                                return {type: 'mention', attrs: {id: `\${secret:${item.name}}`}};
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
                            return $nodes
                                .flatMap(node =>
                                    Object.entries(node.data.data.results).map(([key, schema]) => {
                                        return {type: 'node', node, name: key, schema} satisfies EditorMention;
                                    }),
                                )
                                .filter(item => item.name.toLowerCase().startsWith(query.toLowerCase()))
                                .slice(0, 5);
                        },
                        render() {
                            let target: HTMLDivElement;
                            let instance: Instance;
                            let component: MentionList;
                            const props = $state({mentions: []}) as ComponentProps<MentionList>;
                            const context = new Map();

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
                                    component = mount(MentionList, {props, target, context}) as MentionList;

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
                        const span = document.createElement('span');
                        const [result] = parse(node.attrs.id);

                        switch (result.type) {
                            case 'node': {
                                span.innerText = result.property + (result.path ? '.' + result.path : '');
                                span.classList.add('node', 'mention');
                                span.setAttribute('data-type', 'mention');
                                span.addEventListener('click', () => {
                                    const path = prompt('Property to access (e.g., address.zipcode)', result.path ?? '');

                                    if (path !== null) {
                                        const nodeUri = `\${node:${result.id}:${result.property}}`;
                                        const nodeUriWithPath = `\${node:${result.id}:${result.property}:${path}}`;

                                        editor!.state.doc.descendants((otherNode, position) => {
                                            if (node === otherNode) {
                                                const tr = editor!.state.tr;

                                                tr.setNodeMarkup(position, node.type, {
                                                    ...node.attrs,
                                                    id: path !== '' ? nodeUriWithPath : nodeUri,
                                                });
                                                editor!.view.dispatch(tr);
                                            }
                                        });
                                    }
                                });
                                break;
                            }
                            case 'secret': {
                                span.innerText = result.name;
                                span.classList.add('secret', 'mention');
                                span.setAttribute('data-type', 'mention');
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
    <select bind:value {onchange}>
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
        box-decoration-break: clone;

        color: var(--color-mention-fg);
        cursor: pointer;
        border-radius: 0.5rem;
        background-color: var(--color-mention-bg);
    }
</style>
