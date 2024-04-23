import type {Node} from '@xyflow/svelte';
import type {JSONSchema} from '$lib/schema/schema';

export type AnyNode = ActionNode | TriggerNode;
export type AnyNodeData = ActionNodeData | TriggerNodeData;

export type ActionNode = Node<ActionNodeData>;
export type TriggerNode = Node<TriggerNodeData>;

export interface ActionNodeData {
    type: 'action';
    //
    name: string;
    icon: string;
    //
    inputs: string[];
    outputs: string[];
    params: {order: string[]; values: Record<string, JSONSchema>};
    returns: {order: string[]; values: Record<string, JSONSchema>};
    //
    [x: string]: unknown;
}

export interface TriggerNodeData {
    type: 'trigger';
    //
    name: string;
    icon: string;
    //
    outputs: string[];
    returns: {order: string[]; values: Record<string, JSONSchema>};
    //
    [x: string]: unknown;
}

export const initialNodes: (ActionNode | TriggerNode)[] = [
    {
        id: '0',
        type: 'trigger',
        data: {
            type: 'trigger',
            //
            name: 'webhook',
            icon: 'https://storage.googleapis.com/voltask-assets/plugins-icons/webhook.svg',
            //
            outputs: ['out'],
            returns: {
                order: ['body', 'method', 'headers'],
                values: {
                    body: {type: 'string'},
                    method: {type: 'string'},
                    headers: {type: 'object', additionalProperties: {type: 'string'}},
                },
            },
        },
        position: {x: 0, y: 0},
    },
    {
        id: '1',
        type: 'action',
        data: {
            type: 'action',
            //
            name: 'send mail',
            icon: 'https://storage.googleapis.com/voltask-assets/plugins-icons/smtp.svg',
            //
            inputs: ['in', 'next'],
            outputs: ['out', 'on error'],
            params: {
                order: ['to', 'body', 'headers'],
                values: {
                    to: {type: 'string'},
                    body: {type: 'string'},
                    headers: {type: 'object', additionalProperties: {type: 'string'}},
                },
            },
            returns: {
                order: ['error'],
                values: {error: {type: 'string'}},
            },
        },
        position: {x: 250, y: 0},
    },
    {
        id: '2',
        type: 'action',
        data: {
            type: 'action',
            //
            name: 'send mail',
            icon: 'https://storage.googleapis.com/voltask-assets/plugins-icons/smtp.svg',
            //
            inputs: ['in', 'next'],
            outputs: ['out', 'on error'],
            params: {
                order: ['to', 'body', 'headers'],
                values: {
                    to: {type: 'string'},
                    body: {type: 'string'},
                    headers: {type: 'object', additionalProperties: {type: 'string'}},
                },
            },
            returns: {
                order: ['error'],
                values: {error: {type: 'string'}},
            },
        },
        position: {x: 500, y: -125},
    },
    {
        id: '3',
        type: 'action',
        data: {
            type: 'action',
            //
            name: 'send mail',
            icon: 'https://storage.googleapis.com/voltask-assets/plugins-icons/smtp.svg',
            //
            inputs: ['in', 'next'],
            outputs: ['out', 'on error'],
            params: {
                order: ['to', 'body', 'headers'],
                values: {
                    to: {type: 'string'},
                    body: {type: 'string'},
                    headers: {type: 'object', additionalProperties: {type: 'string'}},
                },
            },
            returns: {
                order: ['error'],
                values: {error: {type: 'string'}},
            },
        },
        position: {x: 500, y: 125},
    },
];
