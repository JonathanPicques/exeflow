import type { default as ProjectsTable } from './Projects';
import type { default as TriggersTable } from './Triggers';

export default interface PublicSchema {
  projects: ProjectsTable;

  triggers: TriggersTable;
}