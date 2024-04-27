import type {Node} from '@xyflow/svelte';
import type {ActionId} from '$lib/plugins/@action';
import type {TriggerId} from '$lib/plugins/@trigger';
import type {JSONSchema} from '$lib/schema/schema';

export type PluginNode = ActionNode | TriggerNode;
export type ActionNode = Node<ActionNodeData>;
export type TriggerNode = Node<TriggerNodeData>;
export type PluginNodeData = ActionNodeData | TriggerNodeData;

export interface ActionNodeData {
    id: ActionId;
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
    id: TriggerId;
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

export const nodes: PluginNode[] = [
    {
        id: '0',
        type: 'trigger',
        data: {
            id: 'webhook:webhook',
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
            id: 'smtp:sendMail',
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
            id: 'smtp:sendMail',
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
            id: 'smtp:sendMail',
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
