create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema extensions;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

create table public.projects (
    id bigint generated by default as identity,
    --
    name text not null,
    image text not null default 'data:null',
    content jsonb null,
    owner_id uuid not null,
    --
    created_at timestamptz with time zone not null default now(),
    updated_at timestamptz with time zone not null default now(),
    --
    constraint public_projects_pkey primary key (id),
    constraint public_projects_owner_id_fkey foreign key (owner_id) references auth.users (id) on delete cascade
) tablespace pg_default;
alter table public.projects enable row level security;

create table public.logs (
    exec_id uuid not null,
    node_id text not null,
    plugin_id text not null,
    project_id bigint not null,
    --
    out text,
    index int4 not null,
    config jsonb,
    results jsonb,
    --
    created_at timestamptz with time zone not null default now(),
    --
    constraint public_logs_project_id_fkey foreign key (project_id) references public.projects (id) on delete cascade
) tablespace pg_default;
alter table public.logs enable row level security;

create table public.secrets (
    key text not null,
    value text not null,
    owner_id uuid not null,
    --
    created_at timestamptz with time zone not null default now(),
    updated_at timestamptz with time zone not null default now(),
    --
    constraint public_secrets_pkey primary key (key, owner_id),
    constraint public_secrets_owner_id_fkey foreign key (owner_id) references auth.users (id) on delete cascade,
    --
    constraint public_secrets_key_not_empty_check check (trim(key) <> '')
) tablespace pg_default;
alter table public.secrets enable row level security;

create table public.triggers (
    node_id text not null,
    plugin_id text not null,
    project_id bigint not null,
    --
    config jsonb,
    --
    created_at timestamptz with time zone not null default now(),
    updated_at timestamptz with time zone not null default now(),
    --
    constraint public_triggers_pkey primary key (node_id, plugin_id, project_id),
    constraint public_triggers_project_id_fkey foreign key (project_id) references public.projects (id) on delete cascade
) tablespace pg_default;
alter table public.triggers enable row level security;
