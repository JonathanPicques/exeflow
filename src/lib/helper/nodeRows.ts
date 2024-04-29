import type {PluginNodeData} from '$lib/graph/nodes';
import type {LeftPoint, RightPoint} from '$lib/graph/points';

export type Row = [LeftPoint | undefined, RightPoint | undefined];

export const nodeRows = (nodeData: PluginNodeData): Row[] => {
    switch (nodeData.type) {
        case 'action': {
            const rows: Row[] = [];
            const inputs = nodeData.inputs.map(id => ({id, type: 'input' as const}));
            const outputs = nodeData.outputs.map(id => ({id, type: 'output' as const}));

            for (let i = 0; i < Math.max(inputs.length, outputs.length); i += 1) {
                rows.push([inputs[i], outputs[i]]);
            }
            return rows;
        }
        case 'trigger': {
            return nodeData.outputs.map(id => [undefined, {id, type: 'output' as const}]);
        }
    }
};
