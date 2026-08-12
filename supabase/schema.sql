create table if not exists public.tool_history (
  id uuid primary key default gen_random_uuid(),
  browser_id uuid not null,
  tool text not null,
  target text not null,
  success boolean not null,
  duration integer not null check (duration >= 0),
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists tool_history_browser_created_idx
  on public.tool_history (browser_id, created_at desc);

alter table public.tool_history enable row level security;

drop policy if exists "browser can read own history" on public.tool_history;
create policy "browser can read own history"
  on public.tool_history for select to anon
  using (browser_id::text = (current_setting('request.headers', true)::json->>'x-browser-id'));

drop policy if exists "browser can insert own history" on public.tool_history;
create policy "browser can insert own history"
  on public.tool_history for insert to anon
  with check (browser_id::text = (current_setting('request.headers', true)::json->>'x-browser-id'));
