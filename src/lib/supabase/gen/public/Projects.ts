import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.projects */
export type ProjectsId = string & { __brand: 'ProjectsId' };

/** Represents the table public.projects */
export default interface ProjectsTable {
  id: ColumnType<ProjectsId, ProjectsId | undefined, ProjectsId>;

  name: ColumnType<string, string, string>;

  image: ColumnType<string, string | undefined, string>;

  content: ColumnType<unknown | null, unknown | null, unknown | null>;

  owner_id: ColumnType<string, string, string>;

  created_at: ColumnType<Date, Date | string | undefined, Date | string>;

  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type Projects = Selectable<ProjectsTable>;

export type NewProjects = Insertable<ProjectsTable>;

export type ProjectsUpdate = Updateable<ProjectsTable>;