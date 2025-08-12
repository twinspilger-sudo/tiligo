```sql
-- Create the profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid references auth.users(id) not null primary key,
  email text unique,
  is_subscribed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS) on the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own profile
CREATE POLICY "Users can view their own profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());

-- Policy for service role to update profiles (for webhooks)
-- This policy allows the service role (which the Edge Function uses) to update any profile.
-- This is necessary for the webhook to set is_subscribed.
CREATE POLICY "Service role can update profiles"
    ON profiles
    FOR UPDATE
    TO service_role
    USING (true);

-- Create a function to create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to call the handle_new_user function on new auth.users inserts
CREATE OR REPLACE TRIGGER on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Optional: Add an index for faster lookups by email if needed
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles (email);
```