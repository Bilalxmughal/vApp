export interface Category {
  id: string
  name: string
  slug: string
  emoji: string
  order_index: number
  is_active: boolean
}

export interface Question {
  id: string
  text: string
  option_a: string
  option_b: string
  category_id: string | null
  category?: Category
  tags: string[]
  status: 'draft' | 'active' | 'archived'
  is_daily: boolean
  daily_date: string | null
  is_user_generated: boolean
  created_by: string | null
  moderation_status: 'pending' | 'approved' | 'rejected'
  vote_count_a: number
  vote_count_b: number
  total_votes: number
  engagement_score: number
  created_at: string
}

export type VoteChoice = 'a' | 'b'

export interface Vote {
  id: string
  question_id: string
  user_id: string | null
  guest_id: string | null
  choice: VoteChoice
  created_at: string
}

export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  is_premium: boolean
  streak_current: number
  streak_longest: number
  streak_last_date: string | null
  total_votes: number
  created_at: string
}

export interface UserDemographics {
  user_id: string
  age_range: '18-24' | '25-34' | '35-44' | '45-54' | '55+' | null
  gender: string | null
  country: string | null
}

// Personality tags derived from vote history
export type PersonalityTag =
  | 'risk_taker'
  | 'practical'
  | 'adventurous'
  | 'homebody'
  | 'money_minded'
  | 'experience_driven'
  | 'social'
  | 'independent'
  | 'planner'
  | 'spontaneous'
  | 'romantic'
  | 'career_driven'
  | 'foodie'
  | 'thrill_seeker'
  | 'luxury_lover'
  | 'minimalist'

export interface PersonalityScore {
  tag: PersonalityTag
  label: string
  score: number
  emoji: string
}

// Vote result with percentage split
export interface VoteResult {
  question_id: string
  choice: VoteChoice
  percent_a: number
  percent_b: number
  total_votes: number
}

// For the "People Like You" feature
export interface DemographicResult {
  group: string
  percent_a: number
  percent_b: number
  total: number
}
