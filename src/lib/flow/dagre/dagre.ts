import dagre from '@dagrejs/dagre';
import {Position} from '@xyflow/svelte';
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
        graph.setNode(node.id, {width: node.computed?.width ?? node.width ?? nodeWidth, height: node.computed?.height ?? node.height ?? nodeHeight});
    }

    dagre.layout(graph);

    return {
        nodes: nodes.map(node => {
            const {x, y} = graph.node(node.id);

            return {
                ...node,
                position: {
                    x: x - nodeWidth / 2,
                    y: y - nodeHeight / 2,
                },
                targetPosition: Position.Left,
                sourcePosition: Position.Right,
            };
        }),
        edges,
    };
};
