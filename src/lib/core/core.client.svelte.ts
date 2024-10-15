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
    sidebar: boolean;
}

export class ProjectContext {
    public pane: Params['pane'] = $state({type: 'nodes'});
    public secrets: Params['secrets'] = $state([]);
    public sidebar: Params['sidebar'] = $state(true);

    public constructor({pane, secrets, sidebar}: Partial<Params>) {
        if (pane !== undefined) this.pane = pane;
        if (secrets !== undefined) this.secrets = secrets;
        if (sidebar !== undefined) this.sidebar = sidebar;
    }

    public setPane = (pane: Pane) => {
        this.pane = pane;
    };

    public showSidebar = () => {
        this.sidebar = true;
    };

    public hideSidebar = () => {
        this.sidebar = false;
    };

    public putSecret = async (secret: Secret) => {
        const newSecret = await putSecret(secret);
        const foundIndex = this.secrets.findIndex(s => s.key === newSecret.key);

        if (foundIndex === -1) {
            this.secrets.push(newSecret);
        } else {
            this.secrets.splice(foundIndex, 1, newSecret);
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
