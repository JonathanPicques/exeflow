import {getContext, setContext} from 'svelte';

import {putSecret, deleteSecret} from '../../routes/api/secrets/secrets';
import type {Secret} from '../../routes/api/secrets/secrets';
import type {PluginNode} from './graph/nodes';

type Pane = LogsPane | NodesPane | SecretsPane;
type LogsPane = {type: 'logs'};
type NodesPane = {type: 'nodes'};
type SecretsPane = {type: 'secrets'};

interface Params {
    pane: Pane;
    secrets: Secret[];
}

export class ProjectContext {
    public pane: Params['pane'] = $state({type: 'nodes'});
    public readonly secrets: Params['secrets'] = $state([]);

    public constructor({pane, secrets}: Partial<Params>) {
        if (pane) this.pane = pane;
        if (secrets) this.secrets = secrets;
    }

    public setPane = (pane: Pane) => {
        this.pane = pane;
    };

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
export const setProjectContext = (params: Partial<Params>) => setContext(projectContextKey, new ProjectContext(params));
