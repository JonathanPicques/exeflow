import * as env from '$env/static/private';
import {ensure} from '$lib/schema/validate';

const string = {type: 'string'} as const;

export const rootUrl = ensure(env.EXEFLOW_ROOT_URL, string, 'EXEFLOW_ROOT_URL env must be a non-empty string');
export const triggerRootUrl = ensure(env.EXEFLOW_ROOT_TRIGGER_URL, string, 'EXEFLOW_ROOT_TRIGGER_URL env must be a non-empty string');
export const webhookRootUrl = ensure(env.EXEFLOW_ROOT_WEBHOOK_URL, string, 'EXEFLOW_ROOT_WEBHOOK_URL env must be a non-empty string');

export const supabaseDbUrl = ensure(env.EXEFLOW_SUPABASE_DB_URL, string, 'EXEFLOW_SUPABASE_DB_URL env must be a non-empty string');
export const supabaseApiUrl = ensure(env.EXEFLOW_SUPABASE_API_URL, string, 'EXEFLOW_SUPABASE_API_URL env must be a non-empty string');
export const supabaseAnonKey = ensure(env.EXEFLOW_SUPABASE_ANON_KEY, string, 'EXEFLOW_SUPABASE_ANON_KEY env must be a non-empty string');
export const supabaseServiceRoleKey = ensure(env.EXEFLOW_SUPABASE_SERVICE_ROLE_KEY, string, 'EXEFLOW_SUPABASE_SERVICE_ROLE_KEY env must be a non-empty string');
