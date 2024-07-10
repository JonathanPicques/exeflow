import type { ProjectsId } from './Projects';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.logs */
export type LogsExecId = string & { __brand: 'LogsExecId' };

/** Identifier type for public.logs */
export type LogsNodeId = string & { __brand: 'LogsNodeId' };

/** Identifier type for public.logs */
export type LogsPluginId = string & { __brand: 'LogsPluginId' };

/** Represents the table public.logs */
export default interface LogsTable {
  exec_id: ColumnType<LogsExecId, LogsExecId, LogsExecId>;

  node_id: ColumnType<LogsNodeId, LogsNodeId, LogsNodeId>;

  plugin_id: ColumnType<LogsPluginId, LogsPluginId, LogsPluginId>;

  project_id: ColumnType<ProjectsId, ProjectsId, ProjectsId>;

  out: ColumnType<string | null, string | null, string | null>;

  config: ColumnType<unknown, unknown, unknown>;

  results: ColumnType<unknown, unknown, unknown>;

  created_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type Logs = Selectable<LogsTable>;

export type NewLogs = Insertable<LogsTable>;

export type LogsUpdate = Updateable<LogsTable>;