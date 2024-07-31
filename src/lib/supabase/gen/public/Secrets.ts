import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.secrets */
export type SecretsId = string & { __brand: 'SecretsId' };

/** Represents the table public.secrets */
export default interface SecretsTable {
  id: ColumnType<SecretsId, SecretsId | undefined, SecretsId>;

  key: ColumnType<string, string, string>;

  value: ColumnType<string, string, string>;

  owner_id: ColumnType<string, string, string>;

  created_at: ColumnType<Date, Date | string | undefined, Date | string>;

  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type Secrets = Selectable<SecretsTable>;

export type NewSecrets = Insertable<SecretsTable>;

export type SecretsUpdate = Updateable<SecretsTable>;