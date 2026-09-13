-- ============================================================
-- Migration 2: Streak logic in vote trigger + engagement score
-- ============================================================

-- Replace update_vote_counts to also handle streak
create or replace function update_vote_counts()
returns trigger language plpgsql as $$
declare
  last_date date;
begin
  -- Update cached vote counts on question
  update questions
  set
    vote_count_a   = vote_count_a + case when new.choice = 'a' then 1 else 0 end,
    vote_count_b   = vote_count_b + case when new.choice = 'b' then 1 else 0 end,
    total_votes    = total_votes + 1,
    -- Simple engagement score: total votes, decayed by age (days since created)
    engagement_score = (total_votes + 1)::float
                       / greatest(1, extract(epoch from (now() - created_at)) / 86400),
    updated_at     = now()
  where id = new.question_id;

  -- Update profile stats + streak if logged-in user
  if new.user_id is not null then
    select streak_last_date into last_date
    from profiles where id = new.user_id;

    update profiles
    set
      total_votes    = total_votes + 1,
      -- Streak: extend if voted yesterday, hold if voted today, reset otherwise
      streak_current = case
        when last_date = current_date            then streak_current
        when last_date = current_date - interval '1 day' then streak_current + 1
        else 1
      end,
      streak_longest = case
        when last_date = current_date            then streak_longest
        when last_date = current_date - interval '1 day'
          then greatest(streak_longest, streak_current + 1)
        else greatest(streak_longest, 1)
      end,
      streak_last_date = case
        when last_date = current_date then last_date
        else current_date
      end
    where id = new.user_id;
  end if;

  return new;
end;
$$;
