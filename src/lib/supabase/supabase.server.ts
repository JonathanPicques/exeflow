import {createClient} from '@supabase/supabase-js';
import type {Cookies} from '@sveltejs/kit';

export const createSupabase = ({url, key, cookies}: {url: string; key: string; cookies: Cookies}) => {
    const supabase = createClient(url, key, {
        auth: {
            flowType: 'pkce',
            persistSession: true,
            autoRefreshToken: false,
            detectSessionInUrl: false,
            //
            storage: {
                isServer: true,
                //
                getItem(key) {
                    return cookies.get(key) ?? null;
                },
                setItem(key, value) {
                    try {
                        cookies.set(key, value, {
                            path: '/',
                            maxAge: 365 * 60 * 60 * 24 * 1000,
                            secure: process.env.NODE_ENV === 'production',
                            httpOnly: true,
                            sameSite: 'lax', // TODO: can only be strict if supabase and exeflow share the same domain
                        });
                    } catch (error) {
                        console.error('setItem failed', {key, value, error});
                    }
                },
                removeItem(key) {
                    try {
                        cookies.delete(key, {
                            path: '/',
                            secure: process.env.NODE_ENV === 'production',
                            httpOnly: true,
                            sameSite: 'lax', // TODO: can only be strict if supabase and exeflow share the same domain
                        });
                    } catch (error) {
                        console.error('removeItem failed', {key, error});
                    }
                },
            },
        },
    });

    return {
        getUser: async () => {
            const response = await supabase.auth.getUser();
            return response.data.user ?? undefined;
        },
        supabase: supabase,
    };
};
