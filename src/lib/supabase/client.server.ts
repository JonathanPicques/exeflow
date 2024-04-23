import {createClient} from '@supabase/supabase-js';
import type {Cookies} from '@sveltejs/kit';

export const supabase = (url: string, key: string, cookies: Cookies) =>
    createClient(url, key, {
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
                    cookies.set(key, value, {
                        path: '/',
                        maxAge: 365 * 60 * 60 * 24 * 1000,
                        secure: process.env.NODE_ENV === 'production',
                        httpOnly: true,
                        sameSite: 'strict',
                    });
                },
                removeItem(key) {
                    cookies.delete(key, {path: '/', httpOnly: true, sameSite: 'lax'});
                },
            },
        },
    });
