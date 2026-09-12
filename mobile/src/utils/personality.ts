import { PersonalityScore, VoteChoice } from '../types'

interface PersonalityTagInput {
  question_id: string
  tag: string
  choice: VoteChoice
  weight: number
}

const tagMeta: Record<string, { label: string; emoji: string }> = {
  risk_taker:    { label: 'Risk Taker',        emoji: '🎲' },
  adventurous:   { label: 'Adventurer',         emoji: '🌍' },
  money_minded:  { label: 'Money Minded',       emoji: '💰' },
  romantic:      { label: 'Romantic',           emoji: '❤️' },
  foodie:        { label: 'Foodie',             emoji: '🍽️' },
  social:        { label: 'Social Butterfly',   emoji: '🦋' },
  homebody:      { label: 'Homebody',           emoji: '🏠' },
  career_driven: { label: 'Career Driven',      emoji: '🚀' },
  spontaneous:   { label: 'Spontaneous',        emoji: '⚡' },
  planner:       { label: 'Planner',            emoji: '📋' },
  thrill_seeker: { label: 'Thrill Seeker',      emoji: '🎢' },
  practical:     { label: 'Practical Thinker',  emoji: '🧠' },
  luxury_lover:  { label: 'Luxury Lover',       emoji: '💎' },
  independent:   { label: 'Independent',        emoji: '💪' },
  experience_driven: { label: 'Experience Seeker', emoji: '✨' },
  minimalist:    { label: 'Minimalist',         emoji: '✂️' },
}

export function calculatePersonality(
  votes: Record<string, VoteChoice>,
  tags: PersonalityTagInput[]
): PersonalityScore[] {
  const scores: Record<string, number> = {}
  const counts: Record<string, number> = {}

  for (const tag of tags) {
    const choice = votes[tag.question_id]
    if (!choice || choice !== tag.choice) continue
    scores[tag.tag] = (scores[tag.tag] ?? 0) + tag.weight
    counts[tag.tag] = (counts[tag.tag] ?? 0) + 1
  }

  return Object.entries(scores)
    .map(([tag, score]): PersonalityScore => ({
      tag: tag as PersonalityScore['tag'],
      label: tagMeta[tag]?.label ?? tag,
      emoji: tagMeta[tag]?.emoji ?? '✦',
      score: Math.round((score / (counts[tag] ?? 1)) * 100),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
}

export function getPersonalityReaction(
  isA: boolean,
  pctA: number
): { title: string; subtitle: string } {
  const majorityPicked = isA ? pctA >= 50 : pctA < 50
  const pct = isA ? pctA : 100 - pctA

  if (majorityPicked) {
    if (pct >= 75) return { title: 'With the crowd', subtitle: `${pct}% of people picked the same.` }
    return { title: 'Popular choice', subtitle: `${pct}% of people agree with you.` }
  } else {
    if (pct <= 25) return { title: 'Rare pick', subtitle: `Only ${pct}% picked this. Very unique!` }
    return { title: 'Bold choice', subtitle: `Only ${pct}% went with this. Nice.` }
  }
}
