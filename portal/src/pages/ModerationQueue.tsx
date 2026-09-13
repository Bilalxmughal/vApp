import { useEffect, useState } from 'react'
import { Check, X, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface PendingQuestion {
  id: string
  text: string
  option_a: string
  option_b: string
  created_at: string
  created_by: string | null
}

export function ModerationQueue() {
  const [questions, setQuestions] = useState<PendingQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  const fetchPending = async () => {
    const { data } = await supabase
      .from('questions')
      .select('id, text, option_a, option_b, created_at, created_by')
      .eq('moderation_status', 'pending')
      .order('created_at', { ascending: true })
    setQuestions((data as PendingQuestion[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPending() }, [])

  const moderate = async (id: string, status: 'approved' | 'rejected') => {
    setActing(id)
    await supabase
      .from('questions')
      .update({
        moderation_status: status,
        status: status === 'approved' ? 'active' : 'draft',
      })
      .eq('id', id)
    setQuestions((prev) => prev.filter((q) => q.id !== id))
    setActing(null)
  }

  return (
    <div>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Moderation Queue</h1>
        {!loading && (
          <span style={styles.badge}>{questions.length} pending</span>
        )}
      </div>

      {loading && <p style={styles.muted}>Loading…</p>}

      {!loading && questions.length === 0 && (
        <div style={styles.empty}>
          <Check size={32} color="#386ebd" strokeWidth={2} />
          <p style={styles.emptyText}>Queue is clear — nothing to review.</p>
        </div>
      )}

      <div style={styles.list}>
        {questions.map((q) => (
          <div key={q.id} style={styles.card}>
            <div style={styles.cardBody}>
              <p style={styles.question}>{q.text}</p>
              <div style={styles.options}>
                <span style={styles.optA}>A: {q.option_a}</span>
                <span style={styles.optB}>B: {q.option_b}</span>
              </div>
              <div style={styles.meta}>
                <Clock size={12} strokeWidth={2} color="#888" />
                <span style={styles.metaText}>
                  {new Date(q.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div style={styles.actions}>
              <button
                style={styles.approveBtn}
                onClick={() => moderate(q.id, 'approved')}
                disabled={acting === q.id}
              >
                <Check size={14} strokeWidth={2.5} />
                Approve
              </button>
              <button
                style={styles.rejectBtn}
                onClick={() => moderate(q.id, 'rejected')}
                disabled={acting === q.id}
              >
                <X size={14} strokeWidth={2.5} />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: '#111',
    letterSpacing: '-0.4px',
    margin: 0,
  },
  badge: {
    backgroundColor: '#386ebd',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 999,
    letterSpacing: '0.3px',
  },
  muted: { color: '#888', fontSize: 14 },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    padding: '48px 24px',
    backgroundColor: '#fff',
    borderRadius: 16,
    border: '1.5px solid #f0f0f0',
  },
  emptyText: { color: '#888', fontSize: 14, margin: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    border: '1.5px solid #f0f0f0',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
  },
  cardBody: { flex: 1, display: 'flex', flexDirection: 'column', gap: 10 },
  question: {
    fontSize: 15,
    fontWeight: 700,
    color: '#111',
    margin: 0,
    lineHeight: 1.4,
  },
  options: { display: 'flex', flexDirection: 'column', gap: 4 },
  optA: {
    fontSize: 13,
    color: '#444',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: '5px 10px',
  },
  optB: {
    fontSize: 13,
    color: '#444',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: '5px 10px',
  },
  meta: { display: 'flex', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 11, color: '#888' },
  actions: { display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 },
  approveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#386ebd',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
  rejectBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f5f5f5',
    color: '#ef4444',
    border: '1.5px solid #fecaca',
    borderRadius: 10,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
}
