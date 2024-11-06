// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for auth.users */
export type authusersid = string;

/**
 * Represents the table auth.users
 * Auth: Stores user login data within a secure schema.
 */
export interface UsersTable {
  id: ColumnType<authusersid, authusersid, authusersid>;

  instance_id: ColumnType<string | null, string | null, string | null>;

  aud: ColumnType<string | null, string | null, string | null>;

  role: ColumnType<string | null, string | null, string | null>;

  email: ColumnType<string | null, string | null, string | null>;

  encrypted_password: ColumnType<string | null, string | null, string | null>;

  email_confirmed_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  invited_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  confirmation_token: ColumnType<string | null, string | null, string | null>;

  confirmation_sent_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  recovery_token: ColumnType<string | null, string | null, string | null>;

  recovery_sent_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  email_change_token_new: ColumnType<string | null, string | null, string | null>;

  email_change: ColumnType<string | null, string | null, string | null>;

  email_change_sent_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  last_sign_in_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  raw_app_meta_data: ColumnType<unknown | null, unknown | null, unknown | null>;

  raw_user_meta_data: ColumnType<unknown | null, unknown | null, unknown | null>;

  is_super_admin: ColumnType<boolean | null, boolean | null, boolean | null>;

  created_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  updated_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  phone: ColumnType<string | null, string | null, string | null>;

  phone_confirmed_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  phone_change: ColumnType<string | null, string | null, string | null>;

  phone_change_token: ColumnType<string | null, string | null, string | null>;

  phone_change_sent_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  confirmed_at: ColumnType<Date | null, never, never>;

  email_change_token_current: ColumnType<string | null, string | null, string | null>;

  email_change_confirm_status: ColumnType<number | null, number | null, number | null>;

  banned_until: ColumnType<Date | null, Date | string | null, Date | string | null>;

  reauthentication_token: ColumnType<string | null, string | null, string | null>;

  reauthentication_sent_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  /** Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails. */
  is_sso_user: ColumnType<boolean, boolean | undefined, boolean>;

  deleted_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  is_anonymous: ColumnType<boolean, boolean | undefined, boolean>;
}

export type Users = Selectable<UsersTable>;

export type NewUsers = Insertable<UsersTable>;

export type UsersUpdate = Updateable<UsersTable>;
