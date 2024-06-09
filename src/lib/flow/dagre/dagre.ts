import dagre from '@dagrejs/dagre';
import type {Graph} from '$lib/core/core';

const nodeWidth = 150;
const nodeHeight = 100;

export const layoutGraph = ({nodes, edges}: Graph): Graph => {
    const graph = new dagre.graphlib.Graph();

    graph.setGraph({rankdir: 'LR'});
    graph.setDefaultEdgeLabel(() => ({}));

    for (const node of nodes) {
        graph.setNode(node.id, {
            width: node.measured?.width ?? nodeWidth,
            height: node.measured?.height ?? nodeHeight,
        });
    }
    for (const edge of edges) {
        graph.setEdge(edge.source, edge.target);
    }

    dagre.layout(graph);

    return {
        edges,
        nodes: nodes.map(node => {
            const {x, y} = graph.node(node.id);

            return {
                ...node,
                position: {
                    x: x - (node.measured?.width ?? nodeWidth) / 2,
                    y: y - (node.measured?.height ?? nodeHeight) / 2,
                },
            };
        }),
    };
};
