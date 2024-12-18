import {getContext, setContext} from 'svelte';

import type {Secret} from '../../routes/api/secrets/secrets';
import type {PluginNode} from '$lib/core/core';

type Tab = LogsTab | NodesTab | SecretsTab;
type LogsTab = {type: 'logs'};
type NodesTab = {type: 'nodes'};
type SecretsTab = {type: 'secrets'};

export class ProjectContext {
    public tab: Tab = $state({type: 'nodes'});
    public secrets: Secret[] = $state([]);
    public sidebar: boolean = $state(true);

    public constructor({
        tab,
        secrets,
        sidebar,
    }: Partial<{
        tab: ProjectContext['tab'];
        secrets: ProjectContext['secrets'];
        sidebar: ProjectContext['sidebar'];
    }>) {
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

    public putSecret = (secret: Secret) => {
        const foundIndex = this.secrets.findIndex(s => s.key === secret.key);

        if (foundIndex === -1) {
            this.secrets.push(secret);
        } else {
            this.secrets.splice(foundIndex, 1, secret);
        }
    };

    public deleteSecret = (key: string) => {
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
export const setProjectContext = (...params: ConstructorParameters<typeof ProjectContext>) => setContext(projectContextKey, new ProjectContext(...params));
