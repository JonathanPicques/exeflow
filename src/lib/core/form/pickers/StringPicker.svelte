<script lang="ts" module>
    import type {JsonSchema} from '$lib/core/schema/schema';

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
    import Text from '@tiptap/extension-text';
    import Mention from '@tiptap/extension-mention';
    import Document from '@tiptap/extension-document';
    import Paragraph from '@tiptap/extension-paragraph';
    import {Editor} from '@tiptap/core';
    import {mount, unmount, onMount, onDestroy} from 'svelte';
    import type {Instance} from 'tippy.js';
    import type {ComponentProps, MountedComponent} from 'svelte';

    import MentionList from './mentions/MentionList.svelte';
    import MentionSpan from './mentions/MentionSpan.svelte';

    import {valid} from '$lib/core/schema/validate';
    import {graphContextKey, getGraphContext} from '$lib/core/core';
    import {projectContextKey, getProjectContext} from '$lib/core/core.client.svelte';
    import {parse, nodeInterpolation, secretInterpolation} from '$lib/core/parse';
    import type {PluginNode} from '$lib/core/core';
    import type {PickerProps} from '$lib/core/form/FormEditor.svelte';
    import type {JsonSchemaString} from '$lib/core/schema/schema';

    let {id, label, value = $bindable(), schema, onchange}: PickerProps<JsonSchemaString> = $props();

    let editor: Editor | undefined = $state();
    let element: HTMLDivElement | undefined = $state();

    const components = new Map();
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
            if (line === '') {
                doc.content.push({type: 'paragraph'});
            } else {
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
        const context: Map<string | symbol, unknown> = new Map();

        context.set(graphContextKey, graphContext);
        context.set(projectContextKey, projectContext);

        editor = new Editor({
            content: deserialize(value),
            element,
            extensions: [
                Text,
                Document,
                Paragraph,
                Mention.configure({
                    suggestion: {
                        items({query}) {
                            const mentions = [
                                ...graphContext.getNodesBefore(id).flatMap(node =>
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
                            let component: MountedComponent<typeof MentionList>;
                            const props: ComponentProps<typeof MentionList> = $state({mentions: []});

                            return {
                                onExit() {
                                    if (instance && component) {
                                        unmount(component);
                                        instance.destroy();

                                        // @ts-expect-error - to make sure we do not double destroy
                                        instance = undefined;
                                        // @ts-expect-error - to make sure we do not double unmount
                                        component = undefined;
                                    }
                                },
                                onStart(params) {
                                    target = document.createElement('div');
                                    instance = tippy(target, {
                                        trigger: 'manual',
                                        content: target,
                                        placement: 'bottom-start',
                                        interactive: true,
                                        showOnCreate: true,
                                        appendTo: () => document.body,
                                        getReferenceClientRect: params.clientRect as () => DOMRect,
                                        //
                                        onHide() {
                                            component.hide();
                                        },
                                        onShown() {
                                            component.show();
                                        },
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
                        command({props, range, editor}) {
                            editor
                                .chain()
                                .focus()
                                .insertContentAt(range, [{type: 'mention', attrs: props}])
                                .run();

                            editor.view.dom.ownerDocument.defaultView?.getSelection()?.collapseToEnd();
                        },
                        allowSpaces: true,
                        allowedPrefixes: null,
                    },
                    renderHTML({node: mentionNode}) {
                        const target = document.createElement('span');

                        components.set(
                            mentionNode,
                            mount(MentionSpan, {
                                props: {
                                    id,
                                    get editor() {
                                        return editor;
                                    },
                                    mentionNode,
                                    interpolations: parse(mentionNode.attrs.id),
                                },
                                target,
                                context,
                            }),
                        );
                        return target;
                    },
                }),
            ],
            onBlur() {
                onchange?.();
            },
            onUpdate(props) {
                value = serialize(props.editor.getJSON() as DocEditorNode);
            },
            onTransaction: props => {
                props.transaction.steps.forEach((step, index) => {
                    if (valid(step, {type: 'object', required: ['jsonID'], properties: {jsonID: {type: 'string'}}})) {
                        if (step.jsonID === 'replace') {
                            const map = props.transaction.mapping.maps[index];
                            if (valid(map, {type: 'object', required: ['ranges'], properties: {ranges: {type: 'array', items: {type: 'number'}}}})) {
                                const start = map.ranges[0];
                                const finish = map.ranges[0] + map.ranges[1];

                                props.transaction.before.nodesBetween(start, finish, node => {
                                    if (node.type.name === 'mention') {
                                        const component = components.get(node);

                                        if (component) {
                                            unmount(component);
                                            components.delete(node);
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            },
        });
    });

    $effect(() => {
        if (editor && value !== serialize(editor.getJSON() as DocEditorNode)) {
            editor.commands.setContent({type: 'doc'}); // make sure to unmount everything
            editor.commands.setContent(deserialize(value)); // prevent losing the cursor position
        }
    });

    onDestroy(() => {
        for (const component of components.values()) {
            unmount(component);
        }
        editor?.destroy();
    });
</script>

<label>
    <span>{label}</span>
    {#if schema.enum}
        <select {onchange} bind:value>
            {#each schema.enum as enumValue, i}
                <option value={enumValue}>
                    {schema.enumLabels?.[i] ?? enumValue}
                </option>
            {/each}
        </select>
    {:else}
        <div class="input" bind:this={element}></div>
    {/if}
</label>

<style>
    label {
        span {
            display: block;
            padding-bottom: 0.5rem;

            color: var(--color-fg-1);
        }
    }

    select {
        width: 100%;
        resize: vertical;
    }

    div.input {
        cursor: text;
    }
</style>
