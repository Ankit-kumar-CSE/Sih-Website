import { useState, useEffect } from 'react'
import AppShell from '../components/AppShell'
import { useAdminAuth } from '../store/adminAuth'
import { adminFetch } from '../hooks/useApi'

const STATE_ROWS = [
  {
    state: 'Punjab State Command',
    sub: 'Doaba, Majha, Malwa Sub-grids',
    mandis: '480 / 482',
    intake: '482,000 Q',
    wait: '32 min',
    waitCls: 'bg-secondary-fixed/40 text-on-secondary-fixed font-semibold',
    silo: 76,
    siloCls: 'bg-secondary-container',
    dbt: '98.2%',
    dbtNote: '(\u20b9112 Cr)',
    status: 'HIGH TRAFFIC',
    statusDot: 'bg-secondary',
    statusCls: 'bg-secondary-container/15 text-secondary border-secondary/30',
    action: 'Inspect Zone',
    redNotice: false,
    rowCls: '',
  },
  {
    state: 'Haryana Mandi Board',
    sub: 'Ambala, Karnal, Hisar Belts',
    mandis: '320 / 320',
    intake: '394,000 Q',
    wait: '29 min',
    waitCls: 'bg-primary-fixed/50 text-on-primary-fixed-variant font-semibold',
    silo: 68,
    siloCls: 'bg-primary-container',
    dbt: '99.1%',
    dbtNote: '(\u20b989 Cr)',
    status: 'NORMAL',
    statusDot: 'bg-primary-container',
    statusCls: 'bg-primary-fixed/30 text-primary-container border-primary-container/30',
    action: 'Inspect Zone',
    redNotice: false,
    rowCls: '',
  },
  {
    state: 'Uttar Pradesh (Western Division)',
    sub: 'Meerut, Aligarh, Agra Mandi Grid',
    mandis: '638 / 650',
    intake: '510,000 Q',
    wait: '44 min',
    waitCls: 'bg-error-container text-error font-bold',
    silo: 82,
    siloCls: 'bg-error',
    dbt: '96.5%',
    dbtNote: '(2.1% retry)',
    status: 'CONGESTION ALERT',
    statusDot: 'bg-error',
    statusCls: 'bg-error-container text-error border-error/30',
    action: 'Issue Red Notice',
    redNotice: true,
    rowCls: 'bg-error-container/10',
    stateCls: 'text-error',
    intakeCls: 'text-on-surface',
    dbtCls: 'text-on-surface',
    dbtNoteCls: 'text-error font-semibold',
  },
  {
    state: 'Madhya Pradesh State Fed',
    sub: 'Malwa, Chambal, Nimar Zones',
    mandis: '402 / 410',
    intake: '280,000 Q',
    wait: '36 min',
    waitCls: 'bg-secondary-fixed/40 text-on-secondary-fixed font-semibold',
    silo: 58,
    siloCls: 'bg-primary-container',
    dbt: '97.8%',
    dbtNote: '(\u20b962 Cr)',
    status: 'NORMAL',
    statusDot: 'bg-primary-container',
    statusCls: 'bg-primary-fixed/30 text-primary-container border-primary-container/30',
    action: 'Inspect Zone',
    redNotice: false,
    rowCls: '',
  },
  {
    state: 'Rajasthan Agriculture Marketing',
    sub: 'Alwar, Kota, Sri Ganganagar Mandis',
    mandis: '254 / 260',
    intake: '158,650 Q',
    wait: '26 min',
    waitCls: 'bg-primary-fixed text-on-primary-fixed-variant font-bold',
    silo: 52,
    siloCls: 'bg-primary-container',
    dbt: '98.9%',
    dbtNote: '(\u20b938 Cr)',
    status: 'OPTIMAL',
    statusDot: 'bg-primary',
    statusCls: 'bg-primary-fixed text-on-primary-fixed-variant border-primary-container/20',
    action: 'Inspect Zone',
    redNotice: false,
    rowCls: '',
  },
]

export default function NationalCommandCentre() {
  const { token, apiBase } = useAdminAuth()
  const [kpis, setKpis] = useState(null)
  const [kpisLoading, setKpisLoading] = useState(true)
  const [clock, setClock] = useState(() =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  )

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await adminFetch(apiBase, token, '/api/admin/dashboard')
        if (!cancelled && data?.kpis) setKpis(data.kpis)
      } catch {
        // API unavailable — static demo data already shown
      } finally {
        if (!cancelled) setKpisLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 30000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [apiBase, token])

  useEffect(() => {
    const tick = setInterval(() => {
      setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  const fmt = (n) => (n == null ? '\u2014' : Number(n).toLocaleString('en-IN'))

  return (
    <AppShell>
      <div className="flex flex-col w-full">
        {/* Page Title Ribbon */}
        <section className="w-full bg-surface-container-lowest border-b border-outline-variant/40 shadow-sm">
          <div className="px-gutter py-space-md flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <div className="flex flex-wrap items-baseline gap-space-md">
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                  National Procurement Command Centre
                </h1>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Live overview of mandi operations across all states
              </p>
            </div>
            {/* Live National Ledger Summary */}
            <div className="flex flex-wrap items-center gap-space-sm bg-surface-container-low p-space-sm rounded border border-outline-variant/30">
              <div className="px-space-sm py-[2px]">
                <div className="font-label-sm text-label-sm uppercase text-outline">Registered Centres</div>
                <div className="font-headline-sm text-headline-sm text-primary font-bold">
                  {kpis ? fmt(kpis.totalCentres) : '\u2014'}
                </div>
              </div>
              <div className="h-6 w-[1px] bg-outline-variant/50"></div>
              <div className="px-space-sm py-[2px]">
                <div className="font-label-sm text-label-sm uppercase text-outline">Active Today</div>
                <div className="font-headline-sm text-headline-sm text-primary-container font-bold">
                  {kpis ? fmt(kpis.activeCentres) : '\u2014'}
                  {kpis && kpis.totalCentres > 0 && (
                    <span className="font-label-sm text-label-sm text-surface-tint font-normal">
                      {' '}({Math.round(kpis.activeCentres / kpis.totalCentres * 100)}%)
                    </span>
                  )}
                </div>
              </div>
              <div className="h-6 w-[1px] bg-outline-variant/50"></div>
              <div className="px-space-sm py-[2px]">
                <div className="font-label-sm text-label-sm uppercase text-outline">Registered Farmers</div>
                <div className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {kpis ? fmt(kpis.totalFarmers) : '\u2014'}
                </div>
              </div>
              <div className="h-6 w-[1px] bg-outline-variant/50"></div>
              <div className="px-space-sm py-[2px] bg-primary-container/10 rounded">
                <div className="font-label-sm text-label-sm uppercase text-primary-container font-bold">
                  Procured Today
                </div>
                <div className="font-headline-sm text-headline-sm text-primary font-bold">
                  {kpis ? fmt(kpis.todayProcuredQ) : '\u2014'} Q
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="w-full my-space-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-space-md">
            {/* KPI 1: Grain Procured */}
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded p-space-md shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                  Today's Intake
                </span>
                <span className="inline-flex items-center gap-[2px] font-label-sm text-label-sm text-primary font-bold bg-primary-fixed/40 px-space-xs py-[1px] rounded">
                  <span className="material-symbols-outlined text-[13px]">arrow_upward</span>14.2%
                </span>
              </div>
              <div className="font-headline-lg text-headline-lg text-primary tracking-tight mb-[2px]">
                1,824,650 <span className="font-label-md text-label-md text-outline font-normal">Q</span>
              </div>
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">Daily Target: 2.10M Q</span>
                  <span className="font-bold text-primary">86.9%</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary-container h-full rounded-full" style={{ width: '86.9%' }}></div>
                </div>
              </div>
            </div>
            {/* KPI 2: Farmers Serviced */}
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded p-space-md shadow-sm">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                  Farmers Processed
                </span>
                <span className="inline-flex items-center gap-[2px] font-label-sm text-label-sm text-surface-tint font-bold bg-primary-fixed/40 px-space-xs py-[1px] rounded">
                  <span className="material-symbols-outlined text-[13px]">arrow_downward</span>8.2% turnaround
                </span>
              </div>
              <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-[2px]">184,230</div>
              <div className="font-label-sm text-label-sm text-outline mt-[2px] truncate">
                Active Tokens in Bay: 18,410
              </div>
            </div>
            {/* KPI 3: Silo & Storage Load */}
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded p-space-md shadow-sm">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                  Storage Silos (Cap)
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-bold bg-secondary-fixed/50 px-space-xs py-[1px] rounded">
                  70.1% Full
                </span>
              </div>
              <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-[2px]">
                8.70M <span className="font-label-md text-label-md text-outline font-normal">/ 12.40M Q</span>
              </div>
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">Safe Buffer Available</span>
                  <span className="font-data-mono font-bold text-primary">3.70M Q</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-secondary-container h-full rounded-full" style={{ width: '70.1%' }}></div>
                </div>
              </div>
            </div>
            {/* KPI 4: DBT */}
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded p-space-md shadow-sm">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                  Real-time DBT Clearance
                </span>
                <span className="font-label-sm text-label-sm text-primary font-bold bg-primary-fixed/40 px-space-xs py-[1px] rounded">
                  99.6% Success
                </span>
              </div>
              <div className="font-headline-lg text-headline-lg text-primary tracking-tight mb-[2px]">
                ₹384.20 <span className="font-label-md text-label-md text-outline font-normal">Cr Today</span>
              </div>
              <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pt-space-xs">
                <span>In NACH Pipeline:</span>
                <span className="font-data-mono font-semibold text-secondary">₹84.20 Cr (0.4% fail)</span>
              </div>
              <div className="font-label-sm text-label-sm text-outline mt-[2px]">Aadhaar Enabled Pay (AePS)</div>
            </div>
            {/* KPI 5: Congestion */}
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded p-space-md shadow-sm">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                  Congestion Triage
                </span>
                <span className="font-label-sm text-label-sm text-error font-bold bg-error-container/60 px-space-xs py-[1px] rounded">
                  14 Overloaded
                </span>
              </div>
              <div className="flex items-baseline gap-space-xs mb-space-xs">
                <span className="font-headline-lg text-headline-lg text-error font-bold">14</span>
                <span className="font-label-sm text-label-sm text-outline">Crit.</span>
                <span className="text-outline-variant">/</span>
                <span className="font-headline-lg text-headline-lg text-secondary font-bold">88</span>
                <span className="font-label-sm text-label-sm text-outline">Warn.</span>
                <span className="text-outline-variant">/</span>
                <span className="font-headline-md text-headline-md text-primary font-bold">2,212</span>
                <span className="font-label-sm text-label-sm text-outline">Nom.</span>
              </div>
              <div className="flex w-full h-2 rounded overflow-hidden">
                <div className="bg-error" style={{ width: '2%' }} title="Critical Overload: 14"></div>
                <div className="bg-secondary-container" style={{ width: '4%' }} title="Warning: 88"></div>
                <div className="bg-primary-container" style={{ width: '94%' }} title="Normal: 2,212"></div>
              </div>
              <div className="font-label-sm text-label-sm text-outline mt-space-xs flex justify-between">
                <span>Yard Wait Time &gt; 120m</span>
                <span className="text-error font-semibold">Action Required</span>
              </div>
            </div>
          </div>
        </section>

        {/* State & Regional Procurement Performance Matrix */}
        <section className="w-full mb-space-lg">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded shadow-sm overflow-hidden">
            {/* Section Header */}
            <div className="px-gutter py-space-md bg-surface-container border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary">
                  State &amp; Regional Procurement Matrix
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Cross-state comparative velocity, depot capacity pressure, and DBT clearing rate.
                </p>
              </div>
              <div className="flex items-center gap-space-sm">
                <button className="bg-surface-container-lowest border border-outline-variant/50 hover:bg-surface-container text-on-surface font-label-md text-label-md px-space-md py-1 rounded transition-colors flex items-center gap-space-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">download</span> Export Report
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/50 text-outline font-label-md text-label-md uppercase tracking-wider">
                    <th className="py-space-sm px-gutter font-bold">State / Zone</th>
                    <th className="py-space-sm px-space-md font-bold text-center">Active Mandis</th>
                    <th className="py-space-sm px-space-md font-bold text-right">Intake Today (Q)</th>
                    <th className="py-space-sm px-space-md font-bold text-center">Avg Wait</th>
                    <th className="py-space-sm px-space-md font-bold">Silo Occupancy</th>
                    <th className="py-space-sm px-space-md font-bold text-right">DBT Rate</th>
                    <th className="py-space-sm px-space-md font-bold text-center">Status</th>
                    <th className="py-space-sm px-gutter font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-body-md text-body-md text-on-surface">
                  {STATE_ROWS.map((row) => (
                    <tr key={row.state} className={`hover:bg-primary-fixed/20 transition-colors ${row.rowCls}`}>
                      <td className="py-space-sm px-gutter">
                        <div className={`font-bold ${row.stateCls || 'text-primary'}`}>{row.state}</div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">{row.sub}</div>
                      </td>
                      <td className="py-space-sm px-space-md text-center font-data-mono font-semibold">{row.mandis}</td>
                      <td className={`py-space-sm px-space-md text-right font-data-mono font-bold ${row.intakeCls || 'text-primary'}`}>
                        {row.intake}
                      </td>
                      <td className="py-space-sm px-space-md text-center">
                        <span className={`inline-block px-space-sm py-[1px] rounded font-data-mono ${row.waitCls}`}>
                          {row.wait}
                        </span>
                      </td>
                      <td className="py-space-sm px-space-md">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-24 bg-surface-container h-2 rounded overflow-hidden">
                            <div
                              className={`${row.siloCls} h-full rounded`}
                              style={{ width: `${row.silo}%` }}
                            ></div>
                          </div>
                          <span className={`font-data-mono text-data-mono font-semibold ${row.silo === 82 ? 'text-error font-bold' : ''}`}>
                            {row.silo}%
                          </span>
                        </div>
                      </td>
                      <td className={`py-space-sm px-space-md text-right font-data-mono font-semibold ${row.dbtCls || 'text-primary'}`}>
                        {row.dbt}{' '}
                        <span className={`text-[11px] font-normal ${row.dbtNoteCls || 'text-outline'}`}>
                          {row.dbtNote}
                        </span>
                      </td>
                      <td className="py-space-sm px-space-md text-center">
                        <span className={`inline-flex items-center gap-1 px-space-sm py-[2px] rounded-full border font-label-sm text-label-sm font-bold ${row.statusCls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${row.statusDot}`}></span> {row.status}
                        </span>
                      </td>
                      <td className="py-space-sm px-gutter text-right">
                        {row.redNotice ? (
                          <button className="bg-error text-on-error font-label-sm text-label-sm px-space-sm py-1 rounded font-bold shadow-xs">
                            {row.action}
                          </button>
                        ) : (
                          <button className="text-primary hover:text-primary-container font-label-md text-label-md font-bold underline decoration-outline-variant/60">
                            {row.action}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-gutter py-space-sm bg-surface-container border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <div className="flex items-center gap-space-sm">
                <span>Showing top 5 states (2,120 of 2,480 mandis)</span>
                <span>&bull;</span>
                <span className="text-primary font-bold">Kharif / Rabi season active</span>
              </div>
              <div className="flex items-center gap-space-xs mt-2 sm:mt-0 font-data-mono">
                <span>Refreshes every 30s</span>
                <span className="text-outline-variant">|</span>
                <span>Local Time: {clock} IST</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
