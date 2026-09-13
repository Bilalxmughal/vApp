import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Stats {
  totalQuestions: number
  pendingReview: number
  totalVotes: number
  totalUsers: number
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('questions').select('id', { count: 'exact', head: true }),
      supabase.from('questions').select('id', { count: 'exact', head: true })
        .eq('moderation_status', 'pending'),
      supabase.from('votes').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ]).then(([q, pq, v, u]) => {
      setStats({
        totalQuestions: q.count ?? 0,
        pendingReview:  pq.count ?? 0,
        totalVotes:     v.count ?? 0,
        totalUsers:     u.count ?? 0,
      })
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <h1 style={styles.title}>Dashboard</h1>

      {loading ? (
        <p style={styles.muted}>Loading…</p>
      ) : stats ? (
        <div style={styles.grid}>
          <StatCard label="Total Questions" value={stats.totalQuestions} />
          <StatCard label="Pending Review" value={stats.pendingReview} accent />
          <StatCard label="Total Votes" value={stats.totalVotes} />
          <StatCard label="Total Users" value={stats.totalUsers} />
        </div>
      ) : null}
    </div>
  )
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div style={{ ...styles.card, ...(accent && value > 0 ? styles.cardAccent : {}) }}>
      <div style={styles.cardValue}>{value.toLocaleString()}</div>
      <div style={styles.cardLabel}>{label}</div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: '#111',
    letterSpacing: '-0.4px',
    marginBottom: 24,
  },
  muted: { color: '#888', fontSize: 14 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: '20px 24px',
    border: '1.5px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  cardAccent: {
    borderColor: '#386ebd',
    backgroundColor: '#f0f5fc',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 900,
    color: '#111',
    letterSpacing: '-0.5px',
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
}
