create table if not exists user_projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  github_url text,
  demo_url text,
  technologies text[] default '{}',
  images text[] default '{}',
  career_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table user_projects enable row level security;

-- Create policies
create policy "Users can view own projects" on user_projects
  for select using (auth.uid() = user_id);

create policy "Users can insert own projects" on user_projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update own projects" on user_projects
  for update using (auth.uid() = user_id);

create policy "Users can delete own projects" on user_projects
  for delete using (auth.uid() = user_id);

-- Create index for better performance
create index user_projects_user_id_idx on user_projects(user_id);
create index user_projects_career_path_idx on user_projects(career_path);

-- Create updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger update_user_projects_updated_at
  before update on user_projects
  for each row
  execute function update_updated_at_column();
