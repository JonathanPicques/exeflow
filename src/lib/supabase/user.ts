import type {User} from '@supabase/supabase-js';

export interface AuthUser {
    id: string;
    type: 'anon' | 'user';
    email: string;
}

export const supabaseUserToAuthUser = (supabaseUser: User): AuthUser => ({
    id: supabaseUser.id,
    type: supabaseUser.is_anonymous ? 'anon' : 'user',
    email: supabaseUser.email ?? 'anon@exeflow.dev',
});
