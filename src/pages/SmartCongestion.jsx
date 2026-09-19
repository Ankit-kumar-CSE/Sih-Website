import { useEffect, useRef, useState } from 'react'
import AppShell from '../components/AppShell'
import { useAdminAuth } from '../store/adminAuth'
import { adminFetch } from '../hooks/useApi'

const FORECAST_ROWS = [
  {
    name: 'Phagwara Mandi',
    code: 'PB-KAP-102 • Kapurthala',
    cap: '500 Q',
    demand: '720 Q',
    demandCls: 'text-error',
    delta: '+220 Q Over',
    deltaCls: 'text-error',
    status: 'HIGH OVERLOAD',
    statusDot: 'bg-error',
    statusCls: 'bg-error-container text-on-error-container',
    action: 'Reroute to Jalandhar East',
    actionCls: 'text-secondary',
    rowCls: '',
    nameCls: '',
  },
  {
    name: 'Kapurthala Main Mandi',
    code: 'PB-KAP-011 • Kapurthala',
    cap: '450 Q',
    demand: '480 Q',
    demandCls: 'text-secondary',
    delta: '+30 Q Over',
    deltaCls: 'text-secondary',
    status: 'MODERATE',
    statusDot: 'bg-secondary',
    statusCls: 'bg-secondary-fixed text-on-secondary-fixed',
    action: 'Reroute to Sultanpur Lodhi',
    actionCls: 'text-secondary',
    rowCls: '',
    nameCls: '',
  },
  {
    name: 'Jalandhar East Mandi',
    code: 'PB-JAL-088 • Jalandhar',
    cap: '500 Q',
    demand: '310 Q',
    demandCls: 'font-bold text-on-surface',
    delta: '+190 Q Surplus',
    deltaCls: 'text-primary',
    status: 'OPTIMAL HUB',
    statusDot: 'bg-primary',
    statusCls: 'bg-primary-fixed text-on-primary-fixed',
    action: 'Receiving Hub Target',
    actionCls: 'text-primary',
    rowCls: 'bg-primary-fixed/20',
    nameCls: 'text-primary',
  },
  {
    name: 'Nakodar Depot Mandi',
    code: 'PB-JAL-122 • Jalandhar',
    cap: '400 Q',
    demand: '280 Q',
    demandCls: 'text-on-surface',
    delta: '+120 Q Surplus',
    deltaCls: 'text-primary',
    status: 'OPTIMAL',
    statusDot: 'bg-primary',
    statusCls: 'bg-primary-fixed text-on-primary-fixed',
    action: 'Secondary Overflow Reserve',
    actionCls: 'text-on-surface-variant',
    rowCls: '',
    nameCls: '',
  },
  {
    name: 'Hoshiarpur South Hub',
    code: 'PB-HSH-045 • Hoshiarpur',
    cap: '400 Q',
    demand: '390 Q',
    demandCls: 'text-on-surface',
    delta: '+10 Q Margin',
    deltaCls: 'text-tertiary',
    status: 'STABLE',
    statusDot: 'bg-tertiary',
    statusCls: 'bg-tertiary-fixed text-on-tertiary-fixed',
    action: 'Self-balanced (No intake change)',
    actionCls: 'text-on-surface-variant',
    rowCls: '',
    nameCls: '',
  },
]

const AUDIT_ROWS = [
  {
    name: 'Harpreet Singh Dhillon',
    vehicle: 'Tractor: PB-08-AW-4410 • ID: #PB-FRM-9021',
    load: 'Paddy (Basmati 1121) — 18.5 Q',
    from: 'Phagwara Mandi',
    fromCls: 'text-error',
    to: 'Jalandhar East (Bay 03)',
    subsidy: '+₹925.00 DBT',
    consent: 'App Confirmed (10:14 AM)',
    consentIcon: 'task_alt',
    consentCls: 'text-primary font-bold',
    time: '3 mins ago',
  },
  {
    name: 'Satnam Verma',
    vehicle: 'Tractor: PB-09-K-1920 • ID: #PB-FRM-4198',
    load: 'Paddy (PR-126) — 24.0 Q',
    from: 'Phagwara Mandi',
    fromCls: 'text-error',
    to: 'Jalandhar East (Bay 01)',
    subsidy: '+₹1,200.00 DBT',
    consent: 'IVR Voice Confirmed',
    consentIcon: 'call',
    consentCls: 'text-secondary font-bold',
    time: '11 mins ago',
  },
  {
    name: 'Gursharanpreet Sandhu',
    vehicle: 'Tractor: PB-36-C-8812 • ID: #PB-FRM-8302',
    load: 'Paddy (Basmati 1509) — 14.2 Q',
    from: 'Phagwara Mandi',
    fromCls: 'text-error',
    to: 'Jalandhar East (Bay 04)',
    subsidy: '+₹710.00 DBT',
    consent: 'SMS Delivered (Pending Tap)',
    consentIcon: 'sync',
    consentIconSpin: true,
    consentCls: 'text-on-surface-variant',
    time: '16 mins ago',
  },
  {
    name: 'Kulwinder Ram',
    vehicle: 'Tractor: PB-08-T-2091 • ID: #PB-FRM-3481',
    load: 'Wheat (PBW 824) — 22.0 Q',
    from: 'Kapurthala Main',
    fromCls: 'text-secondary',
    to: 'Sultanpur Lodhi (Bay 02)',
    subsidy: '+₹1,100.00 DBT',
    consent: 'App Confirmed (09:48 AM)',
    consentIcon: 'task_alt',
    consentCls: 'text-primary font-bold',
    time: '34 mins ago',
  },
]

export default function SmartCongestion() {
  const { token, apiBase } = useAdminAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [executeState, setExecuteState] = useState('idle') // idle | dispatching | active
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await adminFetch(apiBase, token, '/api/admin/analytics')
        if (!cancelled && data?.centreBreakdown) setAnalytics(data)
      } catch {
        // Use static FORECAST_ROWS as fallback
      }
    }
    load()
    const interval = setInterval(load, 30000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [apiBase, token])

  // Map analytics centre breakdown to FORECAST_ROW shape for the table
  const liveRows = analytics?.centreBreakdown?.map((c) => ({
    name: c.centreName || c.centreId,
    code: c.centreId,
    cap: '—',
    demand: `${c.bookings} bookings`,
    demandCls: 'font-bold text-on-surface',
    delta: `${c.procuredQ} Q procured`,
    deltaCls: 'text-primary',
    status: c.bookings > 30 ? 'HIGH TRAFFIC' : c.bookings > 10 ? 'MODERATE' : 'OPTIMAL',
    statusDot: c.bookings > 30 ? 'bg-error' : c.bookings > 10 ? 'bg-secondary' : 'bg-primary',
    statusCls: c.bookings > 30 ? 'bg-error-container text-on-error-container' : c.bookings > 10 ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-primary-fixed text-on-primary-fixed',
    action: 'View Details',
    actionCls: 'text-primary',
    rowCls: '',
    nameCls: '',
  }))

  const forecastRows = liveRows?.length ? liveRows : FORECAST_ROWS

  const [toastVisible, setToastVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const toastTimer = useRef(null)

  const executeRedistribution = () => {
    if (executeState !== 'idle') return
    setExecuteState('dispatching')
    setTimeout(() => {
      setExecuteState('active')
      setToastVisible(true)
      if (toastTimer.current) clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => setToastVisible(false), 5000)
    }, 1200)
  }

  const handleDismiss = () => {
    if (dismissed) return
    setDismissed(true)
  }

  return (
    <AppShell>
      <div className="flex flex-col w-full gap-space-lg">
        {/* Operational Zone Telemetry Strip */}
        <section className="w-full bg-primary text-on-primary rounded-xl p-space-lg shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="space-y-space-xs">
            <div className="flex items-center gap-space-sm flex-wrap">
              <span className="bg-secondary text-on-secondary px-space-xs py-[2px] rounded font-label-sm text-label-sm uppercase tracking-widest font-bold">
                SIH ALGORITHM NODE
              </span>
              <span className="font-headline-md text-headline-md font-bold tracking-tight">
                AI Demand Prediction & Harvest Redistribution Engine v4.2
              </span>
              <span className="bg-primary-container px-space-sm py-[2px] rounded text-primary-fixed font-data-mono text-data-mono">
                MODEL INF-883
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-primary-fixed-dim">
              Operational Scope:{' '}
              <strong className="text-on-primary font-semibold">
                Punjab — Doaba Procurement Zone (18 Mandi Nodes Assayed)
              </strong>{' '}
              • Sentinel-2 Ripening Index Synchronized 4m ago
            </p>
          </div>
          <div className="flex items-center gap-space-lg bg-primary-container/80 px-space-md py-space-sm rounded-lg flex-wrap">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary-fixed text-[18px]">verified</span>
              <div>
                <div className="font-label-sm text-label-sm text-primary-fixed-dim">MODEL CONFIDENCE</div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-primary">94.6%</div>
              </div>
            </div>
            <div className="h-6 w-[1px] bg-outline-variant/30"></div>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary-container text-[18px]">cloud_sync</span>
              <div>
                <div className="font-label-sm text-label-sm text-primary-fixed-dim">CROP INDEX</div>
                <div className="font-headline-sm text-headline-sm font-bold text-secondary-fixed">88.2% Ripe</div>
              </div>
            </div>
            <div className="h-6 w-[1px] bg-outline-variant/30"></div>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-error-container text-[18px] animate-pulse">
                thunderstorm
              </span>
              <div>
                <div className="font-label-sm text-label-sm text-error-container">IMD WEATHER ALERT</div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-primary">Rain in 36h</div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Innovation Hero Banner: Critical Overload Triage & Redistribution */}
        <section
          className={`w-full bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden transition-opacity ${dismissed ? 'opacity-50' : ''}`}
        >
          <div className="bg-error text-on-error px-space-lg py-space-sm flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-[20px]">crisis_alert</span>
              <span className="font-label-lg text-label-lg uppercase tracking-wider font-bold">
                Critical Overload Preventative Action
              </span>
              <span className="bg-surface-container-lowest/20 px-space-xs py-[1px] rounded font-data-mono text-data-mono">
                TRIGGER #RED-4092
              </span>
            </div>
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm">
              <span className="w-2 h-2 rounded-full bg-surface-container-lowest animate-ping"></span>
              <span>PREDICTED BOTTLENECK IN: 18h 40m</span>
            </div>
          </div>

          <div className="p-space-lg space-y-space-lg">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-center">
              {/* Diagnostic Summary */}
              <div className="xl:col-span-7 space-y-space-sm">
                <div className="inline-flex items-center gap-space-xs px-space-sm py-[2px] rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[14px]">warning</span>
                  HIGH CONGESTION COLLISION PROJECTED
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  Phagwara Mandi <span className="font-data-mono text-secondary">(PB-KAP-102)</span> Projected
                  Overload: +220 Q
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Phagwara is slated to receive <strong className="text-error font-semibold">720 Quintals</strong>{' '}
                  tomorrow against a hard throughput limit of{' '}
                  <strong className="text-on-surface font-semibold">500 Q</strong> (+44% excess surge driven by rain
                  pre-harvesting). Automated optimization suggests rerouting{' '}
                  <strong className="text-primary-container font-semibold">220 Quintals (26 Farmer Slot Allocations)</strong>{' '}
                  to <strong className="text-primary font-semibold">Jalandhar East Mandi (PB-JAL-088)</strong>,
                  situated 12 km northwest with 190 Q vacant operational buffer.
                </p>
                <div className="flex items-center gap-space-md pt-space-xs flex-wrap">
                  <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
                    <span className="material-symbols-outlined text-primary text-[18px]">straighten</span>
                    <span>12.4 km Bypass Transit</span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
                    <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                    <span>
                      Govt. Compensated Reroute Incentive:{' '}
                      <strong className="text-on-surface">₹50/Q</strong>
                    </span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
                    <span className="material-symbols-outlined text-primary text-[18px]">cloud_download</span>
                    <span>
                      Estimated Wait Time Reduction:{' '}
                      <strong className="text-primary">58 mins saved/truck</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Real-Time Twin Mandi Simulation Visualizer */}
              <div className="xl:col-span-5 bg-surface-container-low rounded-xl p-space-md shadow-inner space-y-space-md">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                    Dynamic Twin Node Comparison
                  </span>
                  <span className="font-data-mono text-data-mono text-primary font-bold">SIMULATION T-24H</span>
                </div>
                {/* Comparative Node A */}
                <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-error flex items-center gap-space-xs">
                      <span className="w-2 h-2 rounded-full bg-error"></span> Centre A: Phagwara (Overload Source)
                    </span>
                    <span className="font-data-mono text-data-mono font-bold text-error">92% Utilized</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-error h-full rounded-full transition-all duration-500" style={{ width: '92%' }}></div>
                  </div>
                  <div className="grid grid-cols-3 gap-space-xs text-center font-label-sm text-label-sm pt-space-xs text-on-surface-variant">
                    <div>
                      Queue: <strong className="text-on-surface">64 Tractors</strong>
                    </div>
                    <div>
                      Avg Wait: <strong className="text-error">74 mins</strong>
                    </div>
                    <div>
                      Silo Cap: <strong className="text-on-surface">89% Full</strong>
                    </div>
                  </div>
                </div>
                {/* Transfer Arrow */}
                <div className="flex items-center justify-center -my-space-xs text-primary font-label-sm text-label-sm font-bold gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] rotate-90 xl:rotate-0">swap_calls</span>
                  <span>Rerouting 26 Farmers (220 Q) via GT Road Corridor</span>
                </div>
                {/* Comparative Node B */}
                <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-bold text-primary flex items-center gap-space-xs">
                      <span className="w-2 h-2 rounded-full bg-primary"></span> Centre B: Jalandhar East (Receiving
                      Node)
                    </span>
                    <span className="font-data-mono text-data-mono font-bold text-primary">47% Utilized</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '47%' }}></div>
                  </div>
                  <div className="grid grid-cols-3 gap-space-xs text-center font-label-sm text-label-sm pt-space-xs text-on-surface-variant">
                    <div>
                      Queue: <strong className="text-on-surface">18 Tractors</strong>
                    </div>
                    <div>
                      Avg Wait: <strong className="text-primary">16 mins</strong>
                    </div>
                    <div>
                      Silo Cap: <strong className="text-on-surface">42% Avail</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Panel & Statutory Overrides */}
            <div className="bg-surface-container-high/60 p-space-md rounded-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-[20px]">notifications_active</span>
                <span className="font-body-sm text-body-sm">
                  Execution triggers instant multilingual SMS + KisanRaw App notifications to 26 farmers with automatic
                  GPS rerouting and incentive passes.
                </span>
              </div>
              <div className="flex items-center gap-space-sm w-full md:w-auto justify-end flex-wrap">
                <button
                  className="px-space-md py-space-sm bg-surface-container text-on-surface hover:bg-surface-container-highest font-label-md text-label-md rounded shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  onClick={handleDismiss}
                  disabled={dismissed}
                >
                  {dismissed ? 'Dismissed' : 'Dismiss'}
                </button>
                <button
                  className="px-space-md py-space-sm bg-surface-container-lowest text-primary font-label-md text-label-md rounded shadow-sm hover:bg-surface-container transition-colors flex items-center gap-space-xs"
                  onClick={() => setDrawerOpen(!drawerOpen)}
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  Adjust Constraints
                </button>
                <button
                  className={`px-space-lg py-space-sm font-label-lg text-label-lg rounded shadow-md transition-all flex items-center gap-space-xs ${
                    executeState === 'active'
                      ? 'bg-secondary hover:bg-secondary-fixed-dim text-on-secondary'
                      : 'bg-primary hover:bg-primary-container text-on-primary'
                  }`}
                  onClick={executeRedistribution}
                  disabled={executeState === 'dispatching'}
                >
                  {executeState === 'dispatching' ? (
                    <>
                      <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                      Dispatching Orders...
                    </>
                  ) : executeState === 'active' ? (
                    <>
                      <span className="material-symbols-outlined text-[18px]">done_all</span>
                      Redistribution Active
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      Accept & Execute Redistribution
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Parameter Adjuster Drawer (Hidden by default, triggered by button) */}
        {drawerOpen && (
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-lg shadow-lg">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px]">tune</span>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  Redistribution Dynamic Parameter Tuning
                </h3>
              </div>
              <button className="text-on-surface-variant hover:text-on-surface" onClick={() => setDrawerOpen(false)}>
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg pt-space-sm">
              <div className="space-y-space-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Max Distance Ceiling (km)
                </label>
                <input className="w-full accent-primary" max="35" min="5" type="range" defaultValue="15" />
                <div className="flex justify-between font-data-mono text-data-mono text-on-surface">
                  <span>5 km</span>
                  <span className="font-bold text-primary">15 km max</span>
                  <span>35 km</span>
                </div>
              </div>
              <div className="space-y-space-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Incentive Subsidy Multiplier
                </label>
                <div className="flex items-center gap-space-xs">
                  <input
                    className="w-full h-8 px-space-sm bg-surface-container-low rounded font-data-mono text-data-mono text-on-surface"
                    type="number"
                    defaultValue="50"
                  />
                  <span className="font-label-md text-label-md text-on-surface">₹ / Quintal</span>
                </div>
              </div>
              <div className="space-y-space-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  Harvest Batch Window
                </label>
                <select className="w-full h-8 px-space-sm bg-surface-container-low rounded font-data-mono text-data-mono text-on-surface">
                  <option>Next 24 Hours (Urgent)</option>
                  <option>Next 48 Hours (Standard)</option>
                  <option>Weekly Staggered</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Multi-Centre 48-Hour Forecast & Capacity Matrix + Visual Analytics */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
          {/* Regional Capacity Matrix Table */}
          <div className="xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-space-md">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                    ZONAL MANDI RADAR
                  </span>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    48-Hour AI Intake Forecast & Capacity Ledger
                  </h3>
                </div>
                <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-space-xs rounded">
                  <span className="material-symbols-outlined text-[16px] text-primary">filter_alt</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    Doaba Cluster (5 Key Nodes)
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead className="bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase">
                    <tr>
                      <th className="py-space-sm px-space-md rounded-l">Mandi Yard Node</th>
                      <th className="py-space-sm px-space-sm text-right">Throughput Cap</th>
                      <th className="py-space-sm px-space-sm text-right">AI Predicted Demand</th>
                      <th className="py-space-sm px-space-sm text-right">Variance / Delta</th>
                      <th className="py-space-sm px-space-sm text-center">Status / Risk</th>
                      <th className="py-space-sm px-space-md rounded-r">Suggested Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {forecastRows.map((row) => (
                      <tr key={row.code} className={`hover:bg-surface-container-low transition-colors ${row.rowCls}`}>
                        <td className="py-space-md px-space-md font-medium text-on-surface">
                          <div className={`font-headline-sm text-headline-sm font-bold ${row.nameCls}`}>
                            {row.name}
                          </div>
                          <div className="font-data-mono text-data-mono text-outline">{row.code}</div>
                        </td>
                        <td className="py-space-md px-space-sm text-right font-data-mono text-data-mono">{row.cap}</td>
                        <td
                          className={`py-space-md px-space-sm text-right font-data-mono text-data-mono ${row.demandCls}`}
                        >
                          {row.demand}
                        </td>
                        <td
                          className={`py-space-md px-space-sm text-right font-data-mono text-data-mono ${row.deltaCls} font-bold`}
                        >
                          {row.delta}
                        </td>
                        <td className="py-space-md px-space-sm text-center">
                          <span
                            className={`inline-flex items-center gap-space-xs px-space-xs py-[2px] rounded font-label-sm text-label-sm font-bold ${row.statusCls}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${row.statusDot}`}></span> {row.status}
                          </span>
                        </td>
                        <td className={`py-space-md px-space-md font-body-sm text-body-sm font-semibold ${row.actionCls}`}>
                          {row.action}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="pt-space-md flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span>*Aggregated from satellite crop density, historical harvest curves, and e-Kisan booked appointments.</span>
              <span className="font-data-mono text-data-mono text-primary font-bold">Next AI Refresh: 00:14:32</span>
            </div>
          </div>

          {/* 7-Day Inflow Projection Analytics Curve */}
          <div className="xl:col-span-4 bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col justify-between">
            <div className="space-y-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                    FORECAST TRAJECTORY
                  </span>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    7-Day Inflow Smoothing
                  </h3>
                </div>
                <span className="bg-primary/10 text-primary px-space-xs py-[1px] rounded font-label-sm text-label-sm font-bold">
                  AI EQUALIZED
                </span>
              </div>

              {/* Weather alert driving harvest panic banner */}
              <div className="bg-secondary-fixed/50 p-space-sm rounded flex items-start gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">thunderstorm</span>
                <div>
                  <div className="font-label-md text-label-md font-bold text-on-secondary-fixed">
                    Friday IMD Severe Rain Front
                  </div>
                  <div className="font-body-sm text-body-sm text-on-secondary-fixed-variant">
                    Induces early cutting behaviour: unmitigated arrivals spike to 142% on Thursday afternoon.
                  </div>
                </div>
              </div>

              {/* Inline SVG Visualization Chart */}
              <div className="relative w-full h-52 bg-surface-container-low rounded-lg p-space-sm flex flex-col justify-between">
                <div className="flex justify-between font-label-sm text-label-sm text-outline">
                  <span>Capacity (500 Q)</span>
                  <span className="text-error font-bold font-data-mono">120% Critical Surge</span>
                </div>
                <svg className="w-full h-36 overflow-visible" viewBox="0 0 400 180">
                  {/* Safe Operating Zone Shade (Below 80%) */}
                  <rect className="text-primary-fixed/20" fill="currentColor" height="90" width="400" x="0" y="70"></rect>
                  {/* 100% Capacity Guideline */}
                  <line
                    className="text-outline-variant"
                    stroke="currentColor"
                    strokeDasharray="3,3"
                    strokeWidth="1.5"
                    x1="0"
                    x2="400"
                    y1="55"
                    y2="55"
                  ></line>
                  <text className="text-outline font-data-mono text-[9px]" fill="currentColor" textAnchor="end" x="395" y="50">
                    Max Cap 500Q
                  </text>
                  {/* Unmitigated Inflow Curve (Spikes dangerously) */}
                  <path
                    className="text-error"
                    d="M 10 140 Q 60 135, 110 120 T 210 90 T 270 20 T 330 80 T 390 130"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="4,4"
                    strokeWidth="2.5"
                  ></path>
                  {/* AI Rebalanced Curve (Smoothed below safe zone) */}
                  <path
                    className="text-primary"
                    d="M 10 130 Q 60 120, 110 100 T 210 85 T 270 65 T 330 75 T 390 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  ></path>
                  {/* Highlight Peak Dot */}
                  <circle className="text-error" cx="270" cy="20" fill="currentColor" r="4"></circle>
                  <circle className="text-primary" cx="270" cy="65" fill="currentColor" r="4"></circle>
                </svg>
                {/* Day Labels */}
                <div className="flex justify-between font-data-mono text-data-mono text-on-surface-variant pt-space-xs">
                  <span>Wed</span>
                  <span>Thu</span>
                  <span className="text-error font-bold">Fri (Rain)</span>
                  <span>Sat</span>
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant px-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="w-3 h-0.5 bg-error border-b border-dashed"></span>
                  <span>Unmitigated Inflow</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="w-3 h-1 bg-primary rounded-full"></span>
                  <span className="font-bold text-on-surface">AI Redistribution Curve</span>
                </div>
              </div>
            </div>
            <div className="pt-space-md border-t border-surface-container flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
              <span>Average Wait Deviation:</span>
              <span className="font-data-mono text-data-mono font-bold text-primary">-52 mins / yard entry</span>
            </div>
          </div>
        </div>

        {/* Real-Time Farmer Rebalancing Dispatch Audit Log */}
        <section className="w-full bg-surface-container-lowest rounded-xl shadow-md p-space-lg space-y-space-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                  DISPATCH TRAIL
                </span>
                <span className="bg-primary text-on-primary px-space-xs py-[1px] rounded font-label-sm text-label-sm font-bold">
                  LIVE TELEMETRY
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                Target Farmer Rebalancing & Subsidy Dispatch Log
              </h3>
            </div>
            <div className="flex items-center gap-space-sm">
              <input
                className="h-8 px-space-md bg-surface-container-low rounded text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none"
                placeholder="Search Tractor / Farmer Aadhaar..."
                type="text"
              />
              <button className="h-8 px-space-md bg-primary text-on-primary font-label-md text-label-md rounded flex items-center gap-space-xs shadow-sm">
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                Export Audit Trail
              </button>
            </div>
          </div>

          {/* Table of Selected Farmers in Current Target Rebalance */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-body-sm">
              <thead className="bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase">
                <tr>
                  <th className="py-space-sm px-space-md rounded-l">Farmer Identity & Vehicle</th>
                  <th className="py-space-sm px-space-sm">Allocated Crop & Load</th>
                  <th className="py-space-sm px-space-sm">Original Node</th>
                  <th className="py-space-sm px-space-sm">Re-routed Node</th>
                  <th className="py-space-sm px-space-sm">Transit Subsidy Credited</th>
                  <th className="py-space-sm px-space-sm">Farmer Consent Status</th>
                  <th className="py-space-sm px-space-md rounded-r text-right">Audit Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {AUDIT_ROWS.map((row) => (
                  <tr key={row.vehicle} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-space-md px-space-md">
                      <div className="font-headline-sm text-headline-sm font-bold text-on-surface">{row.name}</div>
                      <div className="font-data-mono text-data-mono text-on-surface-variant">{row.vehicle}</div>
                    </td>
                    <td className="py-space-md px-space-sm font-data-mono text-data-mono font-semibold text-on-surface">
                      {row.load}
                    </td>
                    <td className={`py-space-md px-space-sm font-medium ${row.fromCls}`}>{row.from}</td>
                    <td className="py-space-md px-space-sm font-bold text-primary">{row.to}</td>
                    <td className="py-space-md px-space-sm">
                      <span className="bg-primary-fixed text-on-primary-fixed px-space-xs py-[2px] rounded font-data-mono text-data-mono font-bold">
                        {row.subsidy}
                      </span>
                    </td>
                    <td className="py-space-md px-space-sm">
                      <span
                        className={`inline-flex items-center gap-space-xs font-label-md text-label-md ${row.consentCls}`}
                      >
                        <span className={`material-symbols-outlined text-[16px] ${row.consentIconSpin ? 'animate-spin' : ''}`}>
                          {row.consentIcon}
                        </span>
                        {row.consent}
                      </span>
                    </td>
                    <td className="py-space-md px-space-md text-right font-data-mono text-data-mono text-outline">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notification Toast (Appears upon Execution) */}
          {toastVisible && (
            <div className="fixed bottom-space-lg right-space-lg bg-primary text-on-primary px-space-lg py-space-md rounded-xl shadow-2xl flex items-center gap-space-md z-50 animate-bounce">
              <span className="material-symbols-outlined text-[28px] text-secondary">check_circle</span>
              <div>
                <div className="font-headline-sm text-headline-sm font-bold">AI Redistribution Dispatched</div>
                <div className="font-body-sm text-body-sm text-primary-fixed">
                  26 Farmer bookings migrated to Jalandhar East. Route guidance SMS issued.
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  )
}
