import * as env from '$env/static/private';
import {ensureValid} from '$lib/schema/validate';

const string = {type: 'string'} as const;

export const rootUrl = ensureValid(env.EXEFLOW_ROOT_URL, string, 'EXEFLOW_ROOT_URL env must be a non-empty string');
export const triggerRootUrl = ensureValid(env.EXEFLOW_ROOT_TRIGGER_URL, string, 'EXEFLOW_ROOT_TRIGGER_URL env must be a non-empty string');
export const webhookRootUrl = ensureValid(env.EXEFLOW_ROOT_WEBHOOK_URL, string, 'EXEFLOW_ROOT_WEBHOOK_URL env must be a non-empty string');

export const supabaseDbUrl = ensureValid(env.EXEFLOW_SUPABASE_DB_URL, string, 'EXEFLOW_SUPABASE_DB_URL env must be a non-empty string');
export const supabaseApiUrl = ensureValid(env.EXEFLOW_SUPABASE_API_URL, string, 'EXEFLOW_SUPABASE_API_URL env must be a non-empty string');
export const supabaseAnonKey = ensureValid(env.EXEFLOW_SUPABASE_ANON_KEY, string, 'EXEFLOW_SUPABASE_ANON_KEY env must be a non-empty string');
export const supabaseServiceRoleKey = ensureValid(env.EXEFLOW_SUPABASE_SERVICE_ROLE_KEY, string, 'EXEFLOW_SUPABASE_SERVICE_ROLE_KEY env must be a non-empty string');
