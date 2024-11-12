// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for auth.flow_state */
export type authflow_stateid = string;

/**
 * Represents the table auth.flow_state
 * stores metadata for pkce logins
 */
export interface FlowStateTable {
  id: ColumnType<authflow_stateid, authflow_stateid, authflow_stateid>;

  user_id: ColumnType<string | null, string | null, string | null>;

  auth_code: ColumnType<string, string, string>;

  code_challenge_method: ColumnType<unknown, unknown, unknown>;

  code_challenge: ColumnType<string, string, string>;

  provider_type: ColumnType<string, string, string>;

  provider_access_token: ColumnType<string | null, string | null, string | null>;

  provider_refresh_token: ColumnType<string | null, string | null, string | null>;

  created_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  updated_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  authentication_method: ColumnType<string, string, string>;

  auth_code_issued_at: ColumnType<Date | null, Date | string | null, Date | string | null>;
}

export type FlowState = Selectable<FlowStateTable>;

export type NewFlowState = Insertable<FlowStateTable>;

export type FlowStateUpdate = Updateable<FlowStateTable>;