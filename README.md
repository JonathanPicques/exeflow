# Exeflow: Node-based Automation Made Simple

Exeflow empowers you to build powerful automations without writing complex code. Its intuitive node system lets you visually connect actions and triggers, creating workflows that streamline your tasks.

Key Features:
- Simple Node System: Drag, drop, and connect nodes to define your automation logic.
- Powerful Integrations: Automate tasks across various applications and services.
- Effortless Workflow Creation: Build complex automations without coding expertise.
- Increased Efficiency: Save time and effort by automating repetitive tasks.

Exeflow is perfect for:
- Automating daily workflows
- Integrating disparate applications
- Simplifying complex tasks
- Boosting productivity

## Getting started

### Install dependencies

- [PNPM](https://pnpm.io/installation)
- [Supabase CLI](https://github.com/supabase/cli#getting-started)

### Local development

- Run `pnpm install`
- Run `supabase start`
- Run `cp .env.example .env`
- Edit `.env`:
```toml
    EXEFLOW_ROOT_URL="http://localhost:5173" # Must match [auth.additional_redirect_urls] in supabase/config.toml
    EXEFLOW_ROOT_WEBHOOK_URL="http://localhost:5173"
    EXEFLOW_ROOT_TRIGGER_URL="http://host.docker.internal:5173"
    EXEFLOW_SUPABASE_DB_URL="..." # from supabase start
    EXEFLOW_SUPABASE_API_URL="..." # from supabase start
    EXEFLOW_SUPABASE_ANON_KEY="..." # from supabase start
    EXEFLOW_SUPABASE_SERVICE_ROLE_KEY="..." # from supabase start
```
- Run `pnpm dev`

#### Create a development user

- Open [Supabase Studio](http://127.0.0.1:54323)
- Click on `Authentication` in the sidebar
- Click on `Add user` > `Create new user`
- Fill the new user form and click on `Create user`

### Usage

When launched, you can access the following services:

- [Exeflow](http://localhost:5173)
- [Supabase Studio](http://127.0.0.1:54323)
- [Supabase Inbucket](http://127.0.0.1:54324)