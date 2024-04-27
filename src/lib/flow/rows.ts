import type {PluginNodeData} from '$lib/graph/nodes';
import type {LeftPoint, RightPoint} from '$lib/graph/points';

export type Row = [LeftPoint | undefined, RightPoint | undefined];

export const useRows = (nodeData: PluginNodeData): Row[] => {
    switch (nodeData.type) {
        case 'action': {
            const rows: Row[] = [];
            const inputs = nodeData.inputs.map(id => ({id, type: 'input' as const}));
            const outputs = nodeData.outputs.map(id => ({id, type: 'output' as const}));
            const params = nodeData.params.order.map(id => ({id, type: 'param' as const}));
            const returns = nodeData.returns.order.map(id => ({id, type: 'return' as const}));

            for (let i = 0; i < Math.max(inputs.length, outputs.length); i += 1) {
                rows.push([inputs[i], outputs[i]]);
            }
            for (let i = 0; i < Math.max(params.length, returns.length); i += 1) {
                rows.push([params[i], returns[i]]);
            }
            return rows;
        }
        case 'trigger': {
            const rows: Row[] = [];
            const outputs = nodeData.outputs.map(id => ({id, type: 'output' as const}));
            const returns = nodeData.returns.order.map(id => ({id, type: 'return' as const}));

            for (let i = 0; i < outputs.length; i += 1) {
                rows.push([undefined, outputs[i]]);
            }
            for (let i = 0; i < returns.length; i += 1) {
                rows.push([undefined, returns[i]]);
            }
            return rows;
        }
    }
};
