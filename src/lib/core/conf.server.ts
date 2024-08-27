import * as env from '$env/static/private';
import {validOrThrow} from '$lib/schema/validate';

const string = {type: 'string'} as const;

export const rootUrl = validOrThrow(env.EXEFLOW_ROOT_URL, string, 'EXEFLOW_ROOT_URL env must be a non-empty string');
export const triggerRootUrl = validOrThrow(env.EXEFLOW_ROOT_TRIGGER_URL, string, 'EXEFLOW_ROOT_TRIGGER_URL env must be a non-empty string');
export const webhookRootUrl = validOrThrow(env.EXEFLOW_ROOT_WEBHOOK_URL, string, 'EXEFLOW_ROOT_WEBHOOK_URL env must be a non-empty string');

export const supabaseDbUrl = validOrThrow(env.EXEFLOW_SUPABASE_DB_URL, string, 'EXEFLOW_SUPABASE_DB_URL env must be a non-empty string');
export const supabaseApiUrl = validOrThrow(env.EXEFLOW_SUPABASE_API_URL, string, 'EXEFLOW_SUPABASE_API_URL env must be a non-empty string');
export const supabaseAnonKey = validOrThrow(env.EXEFLOW_SUPABASE_ANON_KEY, string, 'EXEFLOW_SUPABASE_ANON_KEY env must be a non-empty string');
export const supabaseServiceRoleKey = validOrThrow(env.EXEFLOW_SUPABASE_SERVICE_ROLE_KEY, string, 'EXEFLOW_SUPABASE_SERVICE_ROLE_KEY env must be a non-empty string');
