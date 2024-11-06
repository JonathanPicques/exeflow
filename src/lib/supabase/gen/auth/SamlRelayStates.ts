// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { authsso_providersid } from './SsoProviders';
import type { authflow_stateid } from './FlowState';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for auth.saml_relay_states */
export type authsaml_relay_statesid = string;

/**
 * Represents the table auth.saml_relay_states
 * Auth: Contains SAML Relay State information for each Service Provider initiated login.
 */
export interface SamlRelayStatesTable {
  id: ColumnType<authsaml_relay_statesid, authsaml_relay_statesid, authsaml_relay_statesid>;

  sso_provider_id: ColumnType<authsso_providersid, authsso_providersid, authsso_providersid>;

  request_id: ColumnType<string, string, string>;

  for_email: ColumnType<string | null, string | null, string | null>;

  redirect_to: ColumnType<string | null, string | null, string | null>;

  created_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  updated_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  flow_state_id: ColumnType<authflow_stateid | null, authflow_stateid | null, authflow_stateid | null>;
}

export type SamlRelayStates = Selectable<SamlRelayStatesTable>;

export type NewSamlRelayStates = Insertable<SamlRelayStatesTable>;

export type SamlRelayStatesUpdate = Updateable<SamlRelayStatesTable>;
