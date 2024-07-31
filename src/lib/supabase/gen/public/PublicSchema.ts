import type { default as ProjectsTable } from './Projects';
import type { default as LogsTable } from './Logs';
import type { default as SecretsTable } from './Secrets';
import type { default as TriggersTable } from './Triggers';

export default interface PublicSchema {
  projects: ProjectsTable;

  logs: LogsTable;

  secrets: SecretsTable;

  triggers: TriggersTable;
}