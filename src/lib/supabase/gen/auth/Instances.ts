// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for auth.instances */
export type authinstancesid = string;

/**
 * Represents the table auth.instances
 * Auth: Manages users across multiple sites.
 */
export interface InstancesTable {
  id: ColumnType<authinstancesid, authinstancesid, authinstancesid>;

  uuid: ColumnType<string | null, string | null, string | null>;

  raw_base_config: ColumnType<string | null, string | null, string | null>;

  created_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  updated_at: ColumnType<Date | null, Date | string | null, Date | string | null>;
}

export type Instances = Selectable<InstancesTable>;

export type NewInstances = Insertable<InstancesTable>;

export type InstancesUpdate = Updateable<InstancesTable>;