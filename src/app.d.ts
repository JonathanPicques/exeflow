import type {Db} from '$lib/supabase/db.server';
import type {createSupabase} from '$lib/supabase/supabase.server';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        interface Error {}
        interface Locals {
            db: Db;
            user: ReturnType<typeof createSupabase>['getUser'];
            supabase: ReturnType<typeof createSupabase>['supabase'];
        }
        interface PageData {}
        interface PageState {}
        interface Platform {}
    }
}

export {};
