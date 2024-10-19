import type {Db} from '$lib/supabase/db.server';
import type {User, SupabaseClient} from '@supabase/supabase-js';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        interface Error {}
        interface Locals {
            db: Db;
            supabase: SupabaseClient;
            //
            user: () => Promise<User | undefined>;
        }
        interface PageData {}
        interface PageState {}
        interface Platform {}
    }
}

export {};
