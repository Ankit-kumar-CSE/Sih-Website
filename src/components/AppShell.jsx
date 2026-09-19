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
               
              </div>
              <p className="font-label-sm text-label-sm text-primary-fixed-dim tracking-tight hidden md:block">
                National Agriculture Procurement Command & Control Grid | Min. of Agriculture & Farmers Welfare
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-gutter hidden lg:block">
            <div className="relative flex items-center">
              
              
             
            </div>
          </div>

          <div className="flex items-center gap-8">

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell preview-icon"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user preview-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>

          </div>
        </div>

        
      </header>

      {/* Jurisdiction Sidebar */}
      <aside className="fixed left-0 top-[92px] bottom-0 w-72 bg-surface-container-low border-r border-outline-variant/40 z-40 flex flex-col overflow-y-auto">
        

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
        

          </div>
        </div>
      </aside>

      {/* Content Column with Breadcrumb Ribbon */}
      <div className="pl-72">
        <div className="w-full bg-surface-container-low border-b border-outline-variant/40 fixed top-[92px] left-72 right-0 z-30">
          <div className="h-10 px-gutter flex items-center justify-between font-label-md text-label-md">
            
            <div className="flex items-center gap-space-md">
              
              
            </div>
          </div>
        </div>

        <main className="relative pt-[132px] w-full min-h-screen bg-surface px-gutter pb-gutter">{children}</main>
      </div>
    </div>
  )
}
