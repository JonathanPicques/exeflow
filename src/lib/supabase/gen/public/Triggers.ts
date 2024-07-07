import type { ProjectsId } from './Projects';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.triggers */
export type TriggersNodeId = string & { __brand: 'TriggersNodeId' };

/** Identifier type for public.triggers */
export type TriggersPluginId = string & { __brand: 'TriggersPluginId' };

/** Represents the table public.triggers */
export default interface TriggersTable {
  node_id: ColumnType<TriggersNodeId, TriggersNodeId, TriggersNodeId>;

  plugin_id: ColumnType<TriggersPluginId, TriggersPluginId, TriggersPluginId>;

  project_id: ColumnType<ProjectsId, ProjectsId, ProjectsId>;

  config: ColumnType<{value: Record<string, unknown>, schema: {}}>;

  created_at: ColumnType<Date, Date | string | undefined, Date | string>;

  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type Triggers = Selectable<TriggersTable>;

export type NewTriggers = Insertable<TriggersTable>;

export type TriggersUpdate = Updateable<TriggersTable>;