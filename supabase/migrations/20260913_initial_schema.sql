-- ============================================================
-- What Would You Pick? — Initial Database Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- CATEGORIES
-- ============================================================
create table categories (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  slug         text not null unique,
  emoji        text not null,
  order_index  int not null default 0,
  is_active    bool not null default true,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  username          text unique,
  avatar_url        text,
  is_premium        bool not null default false,
  streak_current    int not null default 0,
  streak_longest    int not null default 0,
  streak_last_date  date,
  total_votes       int not null default 0,
  created_at        timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- QUESTIONS
-- ============================================================
create table questions (
  id                  uuid primary key default uuid_generate_v4(),
  text                text not null,
  option_a            text not null,
  option_b            text not null,
  category_id         uuid references categories(id) on delete set null,
  tags                text[] not null default '{}',
  status              text not null default 'active' check (status in ('draft','active','archived')),
  is_daily            bool not null default false,
  daily_date          date unique,
  is_user_generated   bool not null default false,
  created_by          uuid references profiles(id) on delete set null,
  moderation_status   text not null default 'approved' check (moderation_status in ('pending','approved','rejected')),
  vote_count_a        int not null default 0,
  vote_count_b        int not null default 0,
  total_votes         int not null default 0,
  engagement_score    float not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Index for daily question lookup
create index idx_questions_daily on questions(daily_date) where is_daily = true;
-- Index for category browsing
create index idx_questions_category on questions(category_id, status, moderation_status);
-- Index for user-generated moderation queue
create index idx_questions_moderation on questions(moderation_status) where is_user_generated = true;

-- ============================================================
-- VOTES
-- ============================================================
create table votes (
  id           uuid primary key default uuid_generate_v4(),
  question_id  uuid not null references questions(id) on delete cascade,
  user_id      uuid references profiles(id) on delete cascade,
  guest_id     text,
  choice       text not null check (choice in ('a','b')),
  created_at   timestamptz not null default now(),

  -- One vote per logged-in user per question
  constraint unique_user_vote unique (question_id, user_id),
  -- One vote per guest device per question
  constraint unique_guest_vote unique (question_id, guest_id),
  -- Must have either user_id or guest_id
  constraint vote_identity check (
    (user_id is not null and guest_id is null) or
    (user_id is null and guest_id is not null)
  )
);

create index idx_votes_question on votes(question_id);
create index idx_votes_user on votes(user_id) where user_id is not null;

-- Trigger: update cached vote counts after insert
create or replace function update_vote_counts()
returns trigger language plpgsql as $$
begin
  update questions
  set
    vote_count_a = vote_count_a + case when new.choice = 'a' then 1 else 0 end,
    vote_count_b = vote_count_b + case when new.choice = 'b' then 1 else 0 end,
    total_votes  = total_votes + 1,
    updated_at   = now()
  where id = new.question_id;

  -- Update user total_votes if logged in
  if new.user_id is not null then
    update profiles
    set total_votes = total_votes + 1
    where id = new.user_id;
  end if;

  return new;
end;
$$;

create trigger on_vote_inserted
  after insert on votes
  for each row execute procedure update_vote_counts();

-- ============================================================
-- QUESTION PERSONALITY TAGS
-- ============================================================
create table question_personality_tags (
  id           uuid primary key default uuid_generate_v4(),
  question_id  uuid not null references questions(id) on delete cascade,
  tag          text not null,
  choice       text not null check (choice in ('a','b')),
  weight       float not null default 1.0 check (weight between 0 and 1)
);

create index idx_personality_tags_question on question_personality_tags(question_id);

-- ============================================================
-- USER DEMOGRAPHICS (optional — for "People Like You")
-- ============================================================
create table user_demographics (
  user_id     uuid primary key references profiles(id) on delete cascade,
  age_range   text check (age_range in ('18-24','25-34','35-44','45-54','55+')),
  gender      text,
  country     text,
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- SUBSCRIPTIONS (RevenueCat synced)
-- ============================================================
create table subscriptions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references profiles(id) on delete cascade,
  platform    text not null check (platform in ('ios','android','web')),
  product_id  text not null,
  status      text not null check (status in ('active','cancelled','expired')),
  expires_at  timestamptz,
  updated_at  timestamptz not null default now()
);

create index idx_subscriptions_user on subscriptions(user_id);

-- Trigger: sync is_premium on profiles when subscription changes
create or replace function sync_premium_status()
returns trigger language plpgsql as $$
begin
  update profiles
  set is_premium = (
    exists (
      select 1 from subscriptions
      where user_id = new.user_id
        and status = 'active'
        and (expires_at is null or expires_at > now())
    )
  )
  where id = new.user_id;
  return new;
end;
$$;

create trigger on_subscription_change
  after insert or update on subscriptions
  for each row execute procedure sync_premium_status();

-- ============================================================
-- NOTIFICATION TOKENS
-- ============================================================
create table notification_tokens (
  user_id                  uuid primary key references profiles(id) on delete cascade,
  push_token               text,
  daily_notif_enabled      bool not null default true,
  streak_notif_enabled     bool not null default true,
  updated_at               timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table categories enable row level security;
alter table profiles enable row level security;
alter table questions enable row level security;
alter table votes enable row level security;
alter table question_personality_tags enable row level security;
alter table user_demographics enable row level security;
alter table subscriptions enable row level security;
alter table notification_tokens enable row level security;

-- Categories: public read
create policy "categories_public_read" on categories
  for select using (is_active = true);

-- Profiles: public read, own write
create policy "profiles_public_read" on profiles
  for select using (true);
create policy "profiles_own_update" on profiles
  for update using (auth.uid() = id);

-- Questions: public read (active + approved)
create policy "questions_public_read" on questions
  for select using (status = 'active' and moderation_status = 'approved');

-- Questions: authenticated users can insert (user-generated)
create policy "questions_user_insert" on questions
  for insert with check (
    auth.uid() is not null
    and is_user_generated = true
    and created_by = auth.uid()
  );

-- Votes: anyone can read aggregate (via questions cached counts)
-- Votes: authenticated users can insert their own vote
create policy "votes_user_insert" on votes
  for insert with check (
    (auth.uid() is not null and user_id = auth.uid() and guest_id is null)
    or
    (auth.uid() is null and user_id is null and guest_id is not null)
  );

-- Users can see their own votes
create policy "votes_own_read" on votes
  for select using (user_id = auth.uid());

-- Personality tags: public read
create policy "personality_tags_public_read" on question_personality_tags
  for select using (true);

-- Demographics: own read/write
create policy "demographics_own_read" on user_demographics
  for select using (auth.uid() = user_id);
create policy "demographics_own_write" on user_demographics
  for all using (auth.uid() = user_id);

-- Subscriptions: own read
create policy "subscriptions_own_read" on subscriptions
  for select using (auth.uid() = user_id);

-- Notification tokens: own read/write
create policy "notification_tokens_own" on notification_tokens
  for all using (auth.uid() = user_id);
