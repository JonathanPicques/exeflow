import type { default as ProjectsTable } from './Projects';
import type { default as TriggersTable } from './Triggers';
import type { default as LogsTable } from './Logs';

export default interface PublicSchema {
  projects: ProjectsTable;

  triggers: TriggersTable;

  logs: LogsTable;
}