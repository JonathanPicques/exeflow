import {getContext, setContext} from 'svelte';

import {putSecret, deleteSecret} from '../../routes/api/secrets/secrets';
import type {Secret} from '../../routes/api/secrets/secrets';
import type {PluginNode} from './graph/nodes';

interface Params {
    secrets: Secret[];
}

export class ProjectContext {
    public readonly secrets: Secret[] = $state([]);

    public constructor({secrets}: Params) {
        this.secrets = secrets;
    }

    public putSecret = async (secret: Secret) => {
        const updatedSecret = await putSecret(secret);

        if (updatedSecret) {
            this.secrets.splice(
                this.secrets.findIndex(s => s.key === updatedSecret.key),
                1,
            );
            this.secrets.push(updatedSecret);
        }
    };

    public deleteSecret = async (key: string) => {
        await deleteSecret({key});
        this.secrets.splice(
            this.secrets.findIndex(s => s.key === key),
            1,
        );
    };

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
