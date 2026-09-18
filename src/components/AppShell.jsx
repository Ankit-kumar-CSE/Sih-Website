import { Link, NavLink } from 'react-router-dom'

export const EMBLEM_SRC =
  'https://lh3.googleusercontent.com/aida/AEtjO1VufOxsMAg6yq70kTd2zmmAd0MRisxlVi20HKm3Y0BRpuy2KbrDMV0udGd6kNbGOSXG_dC6OPP8mMAe3Fv_ftne9WsEeOLsBTJrxGAwUMgF2mbTPDAHTqm-D9xpc8opx6QkBZRdpV4mkMYu__XhZeHvvIpg_q3r1PGUlhsrUpPxTb6SIHh98F_ezqaEkW0LbQQMl97bLWqV4jXve1GfVjm6r6TigonE49_1xUt6600QfpRpiZuPQwxPwmE'

const NAV_SECTIONS = [
  {
    title: '1. Command & Monitoring',
    items: [
      { label: 'National Command Dashboard', icon: 'space_dashboard', route: '/national-command' },
      { label: 'National Map Grid', icon: 'map' },
      { label: 'Regional Overview', icon: 'location_city' },
      { label: 'Live Operations Radar', icon: 'radar' },
    ],
  },
  {
    title: '2. Queue & Counter Ops',
    critical: true,
    items: [
      { label: 'Live Queue Control (Flagship)', icon: 'view_kanban', route: '/live-queue' },
      { label: 'Counter Management', icon: 'countertops' },
      { label: 'Slot & Capacity Allocator', icon: 'calendar_clock' },
      { label: 'Check-in Desk', icon: 'how_to_reg' },
    ],
  },
  {
    title: '3. Procurements & Farmers',
    items: [
      { label: 'Farmer Registry', icon: 'person_search' },
      { label: 'Booking Master', icon: 'receipt_long' },
      { label: 'Procurement Processing', icon: 'fact_check', route: '/procurement' },
      { label: 'Quality & Weighing Station', icon: 'scale' },
      { label: 'End-to-End Tracking', icon: 'local_shipping' },
    ],
  },
  {
    title: '4. Finance & Disbursements',
    items: [
      { label: 'Disbursement Ledger', icon: 'account_balance_wallet' },
      { label: 'Bank Clearing & DBT Status', icon: 'assured_workload' },
    ],
  },
  {
    title: '5. Intelligence & Infra',
    items: [
      { label: 'AI Demand Forecasting', icon: 'psychology' },
      { label: 'Smart Congestion Router', icon: 'alt_route', route: '/smart-congestion' },
      { label: 'Storage Silos & Warehouses', icon: 'warehouse' },
      { label: 'Centre Directory', icon: 'corporate_fare' },
    ],
  },
  {
    title: '6. Governance & Control',
    last: true,
    items: [
      { label: 'Personnel & Operators', icon: 'badge' },
      { label: 'Broadcast Notifications', icon: 'campaign' },
      { label: 'Alert & Incident Logs', icon: 'warning' },
      { label: 'Security & Audit Trail', icon: 'policy' },
      { label: 'System Configuration', icon: 'settings' },
    ],
  },
]

const ACTIVE_LINK =
  'flex items-center gap-space-sm px-space-md py-space-xs rounded transition-all bg-primary-container text-on-primary font-bold shadow-sm'
const INACTIVE_LINK =
  'flex items-center gap-space-sm px-space-md py-space-xs rounded text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all font-body-md text-body-md'

function NavItem({ item }) {
  const icon = <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
  if (item.route) {
    return (
      <NavLink to={item.route} className={({ isActive }) => (isActive ? ACTIVE_LINK : INACTIVE_LINK)}>
        {icon}
        {item.label}
      </NavLink>
    )
  }
  return (
    <a href="#" onClick={(e) => e.preventDefault()} className={INACTIVE_LINK}>
      {icon}
      {item.label}
    </a>
  )
}

export default function AppShell({ children }) {
  const stop = (e) => e.preventDefault()
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
      {/* Sovereign Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary text-on-primary border-b border-outline/30 shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
        <div className="h-14 w-full px-gutter flex items-center justify-between gap-gutter">
          <div className="flex items-center gap-space-md">
            <img alt="KisanRaw Official Emblem" className="h-8 w-auto object-contain" src={EMBLEM_SRC} />
            <div className="h-8 w-[1px] bg-outline-variant/30 hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm uppercase tracking-wider text-on-primary">
                  KisanRaw Centre Operations
                </span>
                <span className="bg-secondary text-on-secondary px-space-xs py-[1px] rounded font-label-sm text-label-sm uppercase tracking-widest font-bold">
                  GOV.IN PORTAL
                </span>
              </div>
              <p className="font-label-sm text-label-sm text-primary-fixed-dim tracking-tight hidden md:block">
                National Agriculture Procurement Command & Control Grid | Min. of Agriculture & Farmers Welfare
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-gutter hidden lg:block">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-space-md text-primary-fixed-dim pointer-events-none text-[18px]">
                search
              </span>
              <input
                className="w-full h-8 pl-9 pr-12 bg-primary-container/80 border border-outline-variant/40 rounded text-on-primary placeholder:text-primary-fixed-dim/70 font-data-mono text-data-mono focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                placeholder="Global Search (A103, Farmer ID, Truck No, MSP Ledger, Booking ID)..."
                type="text"
              />
              <span className="absolute right-space-sm font-label-sm text-label-sm text-primary-fixed-dim/70 border border-outline-variant/30 px-space-xs rounded">
                ⌘K
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="hidden xl:flex items-center gap-space-xs bg-primary-container px-space-md py-space-xs rounded border border-outline-variant/30">
              <span className="material-symbols-outlined text-secondary-container text-[16px]">g_translate</span>
              <span className="font-label-md text-label-md text-on-primary uppercase">English</span>
              <span className="text-outline-variant/60">|</span>
              <span className="font-label-md text-label-md text-primary-fixed-dim hover:text-on-primary cursor-pointer">
                हिन्दी
              </span>
              <span className="text-outline-variant/60">|</span>
              <span className="font-label-md text-label-md text-primary-fixed-dim hover:text-on-primary cursor-pointer">
                ਪੰਜਾਬੀ
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-space-xs bg-primary-container/60 px-space-sm py-[3px] rounded border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary-fixed text-[16px]">verified_user</span>
              <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">2FA SECURED</span>
            </div>
            <button className="relative p-space-xs text-primary-fixed-dim hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary"></span>
            </button>
            <div className="flex items-center gap-space-sm pl-space-sm border-l border-outline-variant/30">
              <div className="text-right hidden sm:block">
                <div className="font-label-md text-label-md leading-tight text-on-primary">Dr. R. K. Swaminathan</div>
                <div className="font-label-sm text-label-sm text-primary-fixed-dim">Dir. Operational Command</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-9 w-full px-gutter bg-primary-container border-t border-outline-variant/20 flex items-center justify-between text-on-primary font-label-md text-label-md overflow-x-auto">
          <div className="flex items-center gap-space-md whitespace-nowrap">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-[16px]">shield</span>
              <span className="text-primary-fixed-dim uppercase tracking-wider font-bold">Active Scope:</span>
              <span className="font-label-md font-bold text-on-primary bg-primary/70 px-space-sm py-[2px] rounded border border-outline-variant/30">
                National Command (2,480 Centres)
              </span>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="text-primary-fixed-dim">Role:</span>
              <div className="flex items-center gap-space-xs">
                <span className="bg-secondary text-on-secondary px-space-xs py-[1px] rounded font-label-sm text-label-sm font-bold">
                  National Admin
                </span>
                <span className="text-primary-fixed-dim/50">•</span>
                <span className="text-primary-fixed-dim hover:text-on-primary cursor-pointer">Regional Admin</span>
                <span className="text-primary-fixed-dim/50">•</span>
                <span className="text-primary-fixed-dim hover:text-on-primary cursor-pointer">Centre Manager</span>
                <span className="text-primary-fixed-dim/50">•</span>
                <span className="text-primary-fixed-dim hover:text-on-primary cursor-pointer">Centre Operator</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-space-lg whitespace-nowrap">
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
              <span className="font-data-mono text-data-mono text-primary-fixed-dim">
                <span className="text-on-primary font-bold">LIVE OPERATIONS</span> — Latency: 24ms | Synced 3s ago |
                Network: Secure NIC-GovNet | 2,314 Centres Online
              </span>
            </div>
            <div className="hidden md:flex items-center gap-space-xs text-secondary-fixed">
              <span className="material-symbols-outlined text-[15px]">campaign</span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider">
                Kharif 2025 MSP MSP-102 Protocol Active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Jurisdiction Sidebar */}
      <aside className="fixed left-0 top-[92px] bottom-0 w-72 bg-surface-container-low border-r border-outline-variant/40 z-40 flex flex-col overflow-y-auto">
        <div className="p-space-md border-b border-outline-variant/30 bg-surface-container">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
              JURISDICTION NODE
            </span>
            <span className="font-data-mono text-data-mono text-secondary font-bold">ID: DL-HQ-01</span>
          </div>
          <div className="font-headline-sm text-headline-sm text-on-surface truncate">HQ Central Apex Command</div>
          <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
            New Delhi — Grid Tier 1
          </div>
        </div>

        <nav className="flex-1 p-space-sm space-y-space-md">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className={`space-y-space-xs ${section.last ? 'pb-space-lg' : ''}`}>
              <div className="px-space-sm py-space-xs font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold flex items-center justify-between">
                <span>{section.title}</span>
                {section.critical && (
                  <span className="bg-secondary/10 text-secondary border border-secondary/30 px-space-xs py-[0.5px] rounded font-label-sm text-label-sm font-bold">
                    CRITICAL
                  </span>
                )}
              </div>
              {section.items.map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
            </div>
          ))}
        </nav>

        <div className="p-space-sm border-t border-outline-variant/30 bg-surface-container-low">
          <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm px-space-sm">
            <span className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Encrypted GovNet
            </span>
            <span className="font-data-mono text-data-mono">v4.2.1-PROD</span>
          </div>
        </div>
      </aside>

      {/* Content Column with Breadcrumb Ribbon */}
      <div className="pl-72">
        <div className="w-full bg-surface-container-low border-b border-outline-variant/40 fixed top-[92px] left-72 right-0 z-30">
          <div className="h-10 px-gutter flex items-center justify-between font-label-md text-label-md">
            <div className="flex items-center gap-space-xs text-on-surface-variant">
              <Link to="/national-command" className="hover:text-primary transition-colors">
                National Command
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-outline">Northern Procurement Grid</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-bold">Terminal Gateway Dispatch</span>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="inline-flex items-center gap-space-xs px-space-sm py-[2px] rounded bg-primary-container/10 text-primary-container border border-primary-container/30 font-label-sm text-label-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                DIRECT MSP COMPLIANT
              </span>
              <span className="text-outline-variant">|</span>
              <span className="font-data-mono text-data-mono text-on-surface-variant">ISO 9001:2015 Assured</span>
            </div>
          </div>
        </div>

        <main className="relative pt-[132px] w-full min-h-screen bg-surface px-gutter pb-gutter">{children}</main>
      </div>
    </div>
  )
}
