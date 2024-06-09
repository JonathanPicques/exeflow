import type {Edge} from '@xyflow/svelte';

import type {JsonSchema} from '$lib/schema/schema';

export type PluginEdge = Edge;

export const edgeSchema = {
    type: 'object',
    required: ['id', 'source', 'target', 'sourceHandle', 'targetHandle'] as const,
    properties: {
        id: {type: 'string'},
        source: {type: 'string'},
        target: {type: 'string'},
        sourceHandle: {type: 'string'},
        targetHandle: {type: 'string'},
    },
} satisfies JsonSchema;
