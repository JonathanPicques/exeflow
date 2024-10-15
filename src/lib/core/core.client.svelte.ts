import {getContext, setContext} from 'svelte';

import {putSecret, deleteSecret} from '../../routes/api/secrets/secrets';
import type {Secret} from '../../routes/api/secrets/secrets';
import type {PluginNode} from './graph/nodes';

type Tab = LogsTab | NodesTab | SecretsTab;
type LogsTab = {type: 'logs'};
type NodesTab = {type: 'nodes'};
type SecretsTab = {type: 'secrets'};

interface Params {
    tab: Tab;
    secrets: Secret[];
    sidebar: boolean;
}

export class ProjectContext {
    public tab: Params['tab'] = $state({type: 'nodes'});
    public secrets: Params['secrets'] = $state([]);
    public sidebar: Params['sidebar'] = $state(true);

    public constructor({tab, secrets, sidebar}: Partial<Params>) {
        if (tab !== undefined) this.tab = tab;
        if (secrets !== undefined) this.secrets = secrets;
        if (sidebar !== undefined) this.sidebar = sidebar;
    }

    public setTab = (tab: Tab) => {
        this.tab = tab;
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
