import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

Deno.serve(async (req) => {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get('Authorization')
  const cronSecret = Deno.env.get('CRON_SECRET')
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]

  // Already have a daily question for today?
  const { data: existing } = await supabase
    .from('questions')
    .select('id, text')
    .eq('is_daily', true)
    .eq('daily_date', today)
    .maybeSingle()

  if (existing) {
    return json({ message: 'Already set', id: existing.id })
  }

  // 1. Pre-scheduled question for today (admin set daily_date in advance)?
  const { data: scheduled } = await supabase
    .from('questions')
    .select('id')
    .eq('status', 'active')
    .eq('moderation_status', 'approved')
    .eq('daily_date', today)
    .eq('is_daily', false)
    .maybeSingle()

  if (scheduled) {
    await supabase
      .from('questions')
      .update({ is_daily: true })
      .eq('id', scheduled.id)
    return json({ message: 'Scheduled question activated', id: scheduled.id })
  }

  // 2. Auto-pick: highest engagement_score not yet used as daily
  const { data: best } = await supabase
    .from('questions')
    .select('id')
    .eq('status', 'active')
    .eq('moderation_status', 'approved')
    .eq('is_daily', false)
    .is('daily_date', null)
    .order('engagement_score', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!best) {
    return json({ error: 'No available question for today' }, 404)
  }

  await supabase
    .from('questions')
    .update({ is_daily: true, daily_date: today })
    .eq('id', best.id)

  return json({ message: 'Auto-assigned daily question', id: best.id })
})

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
