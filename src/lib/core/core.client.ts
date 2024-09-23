import {getContext, setContext} from 'svelte';

import type {PluginNode} from './graph/nodes';

interface Params {}

export class ProjectContext {
    public constructor({}: Params) {}

    public highlightNode = (nodeId: PluginNode['id']) => {
        const element = document.querySelector(`[data-id="${nodeId}"] > .node`);

        element?.classList.add('highlight');
        return () => {
            element?.classList.remove('highlight');
        };
    };
}

export const projectContextKey = Symbol('graph');
export const getProjectContext = () => getContext<ProjectContext>(projectContextKey);
export const setProjectContext = (params: Params) => setContext(projectContextKey, new ProjectContext(params));
