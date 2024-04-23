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
- Create a `.env` file:
```toml
    SUPABASE_API_URL=`API URL` from `supabase start`
    SUPABASE_SERVICE_ROLE_KEY=`service_role key` from `supabase start`
```
- Run `pnpm dev`

When launched, you can access the following services:

- [Exeflow](http://localhost:5173)
- [Supabase Studio](http://127.0.0.1:54323)
- [Supabase Inbucket](http://127.0.0.1:54324)