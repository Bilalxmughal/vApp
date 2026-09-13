import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, ListChecks } from 'lucide-react'

export function Layout() {
  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <span style={styles.brandDot} />
          <span style={styles.brandName}>vApp Portal</span>
        </div>

        <nav style={styles.nav}>
          <NavItem to="/dashboard" icon={<LayoutDashboard size={16} strokeWidth={2} />} label="Dashboard" />
          <NavItem to="/moderation" icon={<ListChecks size={16} strokeWidth={2} />} label="Moderation" />
        </nav>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...styles.navItem,
        ...(isActive ? styles.navItemActive : {}),
      })}
    >
      {icon}
      {label}
    </NavLink>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Inter, system-ui, sans-serif',
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
    width: 220,
    backgroundColor: '#111111',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    flexShrink: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    marginBottom: 16,
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: '#386ebd',
  },
  brandName: {
    color: '#ffffff',
    fontWeight: 800,
    fontSize: 14,
    letterSpacing: '-0.2px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: '0 12px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    borderRadius: 10,
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 500,
    transition: 'background 0.15s, color 0.15s',
  },
  navItemActive: {
    backgroundColor: 'rgba(56,110,189,0.18)',
    color: '#ffffff',
  },
  main: {
    flex: 1,
    padding: 32,
    overflow: 'auto',
  },
}
