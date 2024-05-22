import dagre from '@dagrejs/dagre';
import type {Node, Edge} from '@xyflow/svelte';

const nodeWidth = 150;
const nodeHeight = 100;

export const layoutGraph = <N extends Node, E extends Edge>({nodes, edges}: {nodes: N[]; edges: E[]}): {nodes: N[]; edges: E[]} => {
    const graph = new dagre.graphlib.Graph();

    graph.setGraph({rankdir: 'LR'});
    graph.setDefaultEdgeLabel(() => ({}));

    for (const edge of edges) {
        graph.setEdge(edge.source, edge.target);
    }
    for (const node of nodes) {
        graph.setNode(node.id, {width: node.measured?.width ?? nodeWidth, height: node.measured?.height ?? nodeHeight});
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
