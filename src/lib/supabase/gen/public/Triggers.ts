import type { ProjectsId } from './Projects';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.triggers */
export type TriggersId = string & { __brand: 'TriggersId' };

/** Represents the table public.triggers */
export default interface TriggersTable {
  id: ColumnType<TriggersId, TriggersId | undefined, TriggersId>;

  project_id: ColumnType<ProjectsId | null, ProjectsId | null, ProjectsId | null>;

  type: ColumnType<string | null, string | null, string | null>;

  query: ColumnType<string | null, string | null, string | null>;

  node_id: ColumnType<string | null, string | null, string | null>;

  created_at: ColumnType<Date, Date | string | undefined, Date | string>;

  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type Triggers = Selectable<TriggersTable>;

export type NewTriggers = Insertable<TriggersTable>;

export type TriggersUpdate = Updateable<TriggersTable>;