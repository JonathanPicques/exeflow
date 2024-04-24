import type {DB} from '$lib/supabase/db.server.types';
import type {Kysely} from 'kysely';
import type {AuthUser} from '$lib/api/user';
import type {User, SupabaseClient} from '@supabase/supabase-js';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        interface Error {}
        interface Locals {
            user: () => Promise<AuthUser>;
            migrateAnon: (anonUser: User, signedInUser: User) => Promise<void>;
            //
            db: Kysely<DB>;
            supabase: SupabaseClient;
        }
        interface PageData {}
        interface PageState {}
        interface Platform {}
    }
}

export {};
