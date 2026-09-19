import { NavLink, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../store/adminAuth'

export const EMBLEM_SRC =
  'https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg'

const NAV_SECTIONS = [
  {
    title: 'Command & Monitoring',
    items: [
      { label: 'National Command Dashboard', icon: 'space_dashboard', route: '/national-command' },
    ],
  },
  {
    title: 'Queue & Counter Ops',
    items: [
      { label: 'Live Queue Control', icon: 'view_kanban', route: '/live-queue' },
    ],
  },
  {
    title: 'Procurement',
    items: [
      { label: 'Procurement Processing', icon: 'fact_check', route: '/procurement' },
    ],
  },
  {
    title: 'Intelligence & Routing',
    items: [
      { label: 'Smart Congestion Router', icon: 'alt_route', route: '/smart-congestion' },
    ],
  },
]

const ACTIVE_LINK =
  'flex items-center gap-space-sm px-space-md py-space-xs rounded transition-all bg-primary-container text-on-primary font-bold shadow-sm'
const INACTIVE_LINK =
  'flex items-center gap-space-sm px-space-md py-space-xs rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md'

function NavItem({ item }) {
  const icon = <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
  return (
    <NavLink to={item.route} className={({ isActive }) => (isActive ? ACTIVE_LINK : INACTIVE_LINK)}>
      {icon}
      {item.label}
    </NavLink>
  )
}

export default function AppShell({ children }) {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-on-primary border-b border-outline/30 shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
        <div className="h-14 w-full px-gutter flex items-center justify-between gap-gutter">
          <div className="flex items-center gap-space-md">
            <img alt="India Emblem" className="h-8 w-auto object-contain" src={EMBLEM_SRC} />
            <div className="h-8 w-[1px] bg-outline-variant/30 hidden sm:block"></div>
            <div>
              <span className="font-headline-sm text-headline-sm uppercase tracking-wider text-on-primary">
                KisanRaw Centre Operations
              </span>
              <p className="font-label-sm text-label-sm text-primary-fixed-dim tracking-tight hidden md:block">
                National Agriculture Procurement Command &amp; Control Grid | Min. of Agriculture &amp; Farmers Welfare
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {admin && (
              <span className="hidden md:block font-label-sm text-label-sm text-primary-fixed-dim">
                {admin.name || admin.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-primary-container/20 hover:bg-primary-container/40 text-on-primary font-label-sm text-label-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-14 bottom-0 w-64 bg-surface-container-low border-r border-outline-variant/40 z-40 flex flex-col overflow-y-auto">
        <nav className="flex-1 p-space-sm space-y-space-md pt-space-md">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-space-xs">
              <div className="px-space-sm py-space-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                {section.title}
              </div>
              {section.items.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
            </div>
          ))}
        </nav>

        <div className="p-space-sm border-t border-outline-variant/30 bg-surface-container-low">
          <div className="flex items-center gap-2 px-space-sm py-space-xs text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px]">shield</span>
            <span>KisanRaw Admin Portal</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="pl-64 pt-14">
        <main className="relative w-full min-h-screen bg-surface px-gutter pb-gutter pt-gutter">
          {children}
        </main>
      </div>
    </div>
  )
}
