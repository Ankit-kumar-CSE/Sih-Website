import { useState } from 'react'
import AppShell from '../components/AppShell'

const DEFAULT_CENTRE = {
  name: 'Phagwara Mandi Centre',
  region: 'Kapurthala District | Region: Punjab — Doaba',
  id: 'PB-KAP-102',
  queue: '34',
  wait: '28',
  intake: '3,420 / 4,000 Q (85.5%)',
  silo: '14,200 / 18,000 Q (78.9%)',
  intakeBar: '85.5%',
  siloBar: '78.9%',
}

const COMMODITIES = ['Wheat (MSP ₹2,275)', 'Paddy', 'Mustard', 'Gram']

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
    dbtNote: '(₹112 Cr)',
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
    dbtNote: '(₹89 Cr)',
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
    dbtNote: '(₹62 Cr)',
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
    dbtNote: '(₹38 Cr)',
    status: 'OPTIMAL',
    statusDot: 'bg-primary',
    statusCls: 'bg-primary-fixed text-on-primary-fixed-variant border-primary-container/20',
    action: 'Inspect Zone',
    redNotice: false,
    rowCls: '',
  },
]

export default function NationalCommandCentre() {
  const [centre, setCentre] = useState(DEFAULT_CENTRE)
  const [commodity, setCommodity] = useState(0)

  const highlightCentre = (name, region, intake, silo, queue, wait, intakeBar, siloBar) => {
    const match = name.match(/\((.*?)\)/)
    setCentre({
      name,
      region,
      intake,
      silo,
      queue: String(queue),
      wait: String(wait),
      intakeBar: intakeBar || centre.intakeBar,
      siloBar: siloBar || centre.siloBar,
      id: match ? match[1] : centre.id,
    })
  }

  return (
    <AppShell>
      <div className="flex flex-col w-full">
        {/* Sovereign National Scope & Apex Title Ribbon */}
        <section className="w-full bg-surface-container-lowest border-b border-outline-variant/40 shadow-sm">
          <div className="px-gutter py-space-md flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
            <div className="flex flex-col gap-space-xs">
              <div className="flex flex-wrap items-center gap-space-sm">
                
                <span className="text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider font-bold">
                  ROLE: NATIONAL CHIEF PROCUREMENT ADMINISTRATOR
                </span>
                
               
              </div>
              <div className="flex flex-wrap items-baseline gap-space-md">
                <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
                  National Procurement Operations Command Centre
                </h1>
                
              </div>
            </div>
            {/* Live National Ledger Summary */}
            <div className="flex flex-wrap items-center gap-space-sm bg-surface-container-low p-space-sm rounded border border-outline-variant/30">
              <div className="px-space-sm py-[2px]">
                <div className="font-label-sm text-label-sm uppercase text-outline">Registered Centres</div>
                <div className="font-headline-sm text-headline-sm text-primary font-bold">2,480</div>
              </div>
              <div className="h-6 w-[1px] bg-outline-variant/50"></div>
              <div className="px-space-sm py-[2px]">
                <div className="font-label-sm text-label-sm uppercase text-outline">Active Today</div>
                <div className="font-headline-sm text-headline-sm text-primary-container font-bold">
                  2,314 <span className="font-label-sm text-label-sm text-surface-tint font-normal">(93.3%)</span>
                </div>
              </div>
              <div className="h-6 w-[1px] bg-outline-variant/50"></div>
              <div className="px-space-sm py-[2px]">
                <div className="font-label-sm text-label-sm uppercase text-outline">Registered Farmers</div>
                <div className="font-headline-sm text-headline-sm text-on-surface font-bold">9,842,120</div>
              </div>
              <div className="h-6 w-[1px] bg-outline-variant/50"></div>
              <div className="px-space-sm py-[2px] bg-primary-container/10 rounded">
                <div className="font-label-sm text-label-sm uppercase text-primary-container font-bold">
                  Procured Today 
                </div>
                <div className="font-headline-sm text-headline-sm text-primary font-bold">1,824,650 Q</div>
              </div>
            </div>
          </div>
        </section>

        {/* Macro Operational KPI Command Cards (5-Column Dense Grid) */}
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
            {/* KPI 4: Direct Benefit Transfer (DBT) */}
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
            {/* KPI 5: National Congestion Grid */}
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

        {/* High-Priority National Alert & Congestion Intelligence Ribbon */}
        

        {/* Flagship Interactive National Map Command Visualizer & Centre Inspection Drawer */}
        <section className="w-full mb-space-md">
          <div className="bg-surface-container-lowest border border-outline-variant/40 rounded shadow-sm overflow-hidden">
            {/* Visualizer Tooling & Filter Controls */}
            <div className="p-space-md bg-surface-container border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-space-md">
              <div className="flex flex-wrap items-center gap-space-md">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">public</span>
                  <span className="font-headline-sm text-headline-sm text-primary uppercase">
                    INDIA GEO-PROCUREMENT GRID (2,480 CENTRES)
                  </span>
                </div>
                <span className="text-outline-variant hidden sm:inline">|</span>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase text-outline font-bold">ZONE FILTER:</span>
                  <select
                    className="bg-surface-container-lowest border border-outline-variant/50 text-on-surface font-label-md text-label-md px-space-sm py-1 rounded focus:outline-none focus:border-primary"
                    defaultValue="north"
                  >
                    <option value="all">All 6 Sovereign Zones</option>
                    <option value="north">North Zone (Punjab, HR, Western UP)</option>
                    <option value="central">Central Belt (MP, Rajasthan)</option>
                    <option value="east">East Zone (WB, Bihar, Odisha)</option>
                    <option value="south">South Zone (AP, Telangana, TN)</option>
                    <option value="west">West Zone (Gujarat, Maharashtra)</option>
                  </select>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-label-sm uppercase text-outline font-bold">COMMODITY:</span>
                  <div className="flex items-center bg-surface-container-lowest border border-outline-variant/50 rounded p-[2px]">
                    {COMMODITIES.map((item, idx) => (
                      <button
                        key={item}
                        onClick={() => setCommodity(idx)}
                        className={`px-space-sm py-[2px] font-label-sm text-label-sm rounded ${
                          commodity === idx
                            ? 'bg-primary text-on-primary font-bold'
                            : 'text-on-surface-variant hover:text-on-surface font-medium'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-space-sm">
                <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-1 rounded border border-outline-variant/40 font-label-sm text-label-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                  <span>Overload (&gt;90%)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container ml-space-xs"></span>
                  <span>Heavy (75-90%)</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container ml-space-xs"></span>
                  <span>Normal (&lt;75%)</span>
                </div>
               
              </div>
            </div>

            {/* Dual Split Work Area: Interactive Map Canvas + Pinned Centre Inspection Drawer */}
            <div className="grid grid-cols-1 xl:grid-cols-12 min-h-[580px]">
              {/* National Map Grid Canvas (8 Cols on xl) */}
              <div className="xl:col-span-8 bg-surface-container-low relative flex flex-col border-b xl:border-b-0 xl:border-r border-outline-variant/30">
                {/* Ambient Map Grid Header Info Overlay */}
                <div className="absolute top-space-md left-space-md z-10 bg-surface-container-lowest/90 backdrop-blur border border-outline-variant/40 p-space-sm rounded shadow-sm max-w-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-sm text-label-sm uppercase font-bold text-primary">
                      Granary Activity Matrix
                    </span>
                    <span className="font-data-mono text-[10px] text-outline">NIC-GIS-V7</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Showing real-time transshipment density & depot yard congestion across northern procurement
                    corridors.
                  </p>
                </div>

                {/* Synthetic Interactive SVG Geospatial Visualization of India's Agrarian Mandi Clusters */}
                <div className="w-full flex-1 flex items-center justify-center p-space-md relative min-h-[460px] select-none bg-[#f1f5fa] overflow-hidden">
                  {/* Grid Watermark / Administrative coordinates */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#003527 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                  ></div>

                  {/* Stylized India Regional Mandi Vector Visualizer */}
                  <svg className="w-full max-w-[740px] h-auto drop-shadow-sm font-label-md" viewBox="0 0 800 620">
                    <defs>
                      <linearGradient id="gridGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#003527" stopOpacity="0.06"></stop>
                        <stop offset="100%" stopColor="#fe932c" stopOpacity="0.04"></stop>
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur result="coloredBlur" stdDeviation="3"></feGaussianBlur>
                        <feMerge>
                          <feMergeNode in="coloredBlur"></feMergeNode>
                          <feMergeNode in="SourceGraphic"></feMergeNode>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Outlined Macro Agrarian Zones */}
                    {/* Northern Wheat Belt (Punjab, Haryana, W-UP) */}
                    <path
                      d="M 230,110 L 330,90 L 390,130 L 420,200 L 350,260 L 260,240 L 210,180 Z"
                      fill="url(#gridGrad)"
                      stroke="#064e3b"
                      strokeDasharray="3 3"
                      strokeWidth="1.5"
                    ></path>
                    {/* Central Oilseed & Pulses Belt (MP, East Rajasthan) */}
                    <path
                      d="M 270,260 L 430,220 L 490,290 L 470,390 L 330,420 L 250,340 Z"
                      fill="url(#gridGrad)"
                      stroke="#707974"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    ></path>
                    {/* Eastern Paddy Belt (Bihar, WB, Odisha) */}
                    <path
                      d="M 470,230 L 610,210 L 650,300 L 590,410 L 510,340 L 480,270 Z"
                      fill="url(#gridGrad)"
                      stroke="#707974"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    ></path>
                    {/* Southern Paddy & Coarse Grain Belt */}
                    <path
                      d="M 330,430 L 480,410 L 440,560 L 370,590 L 310,500 Z"
                      fill="url(#gridGrad)"
                      stroke="#707974"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    ></path>

                    {/* Inter-Hub Logistics High-Speed Corridors */}
                    <path
                      className="animate-pulse"
                      d="M 285,155 Q 360,195 400,295"
                      fill="none"
                      stroke="#fe932c"
                      strokeDasharray="4 4"
                      strokeWidth="2"
                    ></path>
                    <path
                      d="M 285,155 Q 480,180 540,250"
                      fill="none"
                      stroke="#004870"
                      strokeDasharray="3 3"
                      strokeWidth="1.5"
                    ></path>
                    <path d="M 400,295 Q 410,410 390,510" fill="none" stroke="#064e3b" strokeWidth="1.5"></path>

                    {/* Northern Granary Cluster Nodes */}
                    {/* Punjab: Phagwara (SELECTED) */}
                    <g
                      className="cursor-pointer group"
                      onClick={() =>
                        highlightCentre(
                          'Phagwara Mandi Centre (PB-KAP-102)',
                          'Punjab — Doaba',
                          '3,420 Q (85.5%)',
                          '14,200 / 18,000 Q (78.9%)',
                          34,
                          28,
                          '85.5%',
                          '78.9%',
                        )
                      }
                    >
                      <circle className="animate-ping" cx="285" cy="155" fill="#fe932c" fillOpacity="0.2" r="14"></circle>
                      <circle cx="285" cy="155" fill="#003527" r="7" stroke="#ffffff" strokeWidth="2"></circle>
                      <rect fill="#003527" height="20" rx="3" width="100" x="235" y="125"></rect>
                      <text fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" x="285" y="139">
                        ★ Phagwara (Active)
                      </text>
                    </g>
                    {/* Sangrur Overload Centre (RED) */}
                    <g
                      className="cursor-pointer group"
                      onClick={() =>
                        highlightCentre(
                          'Sangrur Central Yard (PB-SNG-004)',
                          'Punjab — Malwa',
                          '4,890 Q (97.8%)',
                          '19,400 / 20,000 Q (97.0%)',
                          92,
                          145,
                          '97.8%',
                          '97.0%',
                        )
                      }
                    >
                      <circle className="animate-pulse" cx="265" cy="180" fill="#ba1a1a" fillOpacity="0.3" r="12"></circle>
                      <circle cx="265" cy="180" fill="#ba1a1a" r="6" stroke="#ffffff" strokeWidth="2"></circle>
                      <text fill="#ba1a1a" fontSize="9" fontWeight="bold" textAnchor="middle" x="265" y="202">
                        Sangrur (97% FULL)
                      </text>
                    </g>
                    {/* Karnal Mandi (GREEN) */}
                    <g
                      className="cursor-pointer group"
                      onClick={() =>
                        highlightCentre(
                          'Karnal Grain Hub (HR-KAR-011)',
                          'Haryana — Ambala Division',
                          '2,980 Q (62.0%)',
                          '11,200 / 22,000 Q (50.9%)',
                          18,
                          19,
                          '62.0%',
                          '50.9%',
                        )
                      }
                    >
                      <circle cx="315" cy="185" fill="#064e3b" r="5" stroke="#ffffff" strokeWidth="1.5"></circle>
                      <text fill="#064e3b" fontSize="9" fontWeight="bold" textAnchor="middle" x="315" y="175">
                        Karnal
                      </text>
                    </g>
                    {/* Western UP: Aligarh Mandi (AMBER) */}
                    <g
                      className="cursor-pointer group"
                      onClick={() =>
                        highlightCentre(
                          'Aligarh Nodal Mandi (UP-ALI-042)',
                          'Uttar Pradesh — Western',
                          '3,910 Q (89.1%)',
                          '17,100 / 19,000 Q (90.0%)',
                          58,
                          62,
                          '89.1%',
                          '90.0%',
                        )
                      }
                    >
                      <circle cx="355" cy="210" fill="#fe932c" r="6" stroke="#ffffff" strokeWidth="1.5"></circle>
                      <text fill="#404944" fontSize="9" fontWeight="bold" textAnchor="middle" x="355" y="228">
                        Aligarh Hub
                      </text>
                    </g>
                    {/* Central MP: Bhopal Grain Depot */}
                    <g
                      className="cursor-pointer group"
                      onClick={() =>
                        highlightCentre(
                          'Bhopal State Silo Hub (MP-BHO-002)',
                          'Madhya Pradesh — Central',
                          '2,140 Q (53.5%)',
                          '9,400 / 25,000 Q (37.6%)',
                          12,
                          15,
                          '53.5%',
                          '37.6%',
                        )
                      }
                    >
                      <circle cx="360" cy="335" fill="#064e3b" r="5" stroke="#ffffff" strokeWidth="1.5"></circle>
                      <text fill="#064e3b" fontSize="9" fontWeight="bold" textAnchor="middle" x="360" y="352">
                        Bhopal Hub
                      </text>
                    </g>
                    {/* Kota Yard (Rajasthan) */}
                    <g
                      className="cursor-pointer group"
                      onClick={() =>
                        highlightCentre(
                          'Kota Mandi Yard (RJ-KOT-08)',
                          'Rajasthan — Hadoti Belt',
                          '1,780 Q (48.0%)',
                          '7,200 / 16,000 Q (45.0%)',
                          9,
                          14,
                          '48.0%',
                          '45.0%',
                        )
                      }
                    >
                      <circle cx="295" cy="275" fill="#064e3b" r="5" stroke="#ffffff" strokeWidth="1.5"></circle>
                      <text fill="#064e3b" fontSize="9" fontWeight="bold" textAnchor="middle" x="295" y="265">
                        Kota Depot
                      </text>
                    </g>
                    {/* Eastern Belt: Bardhaman Paddy Mandi */}
                    <g
                      className="cursor-pointer group"
                      onClick={() =>
                        highlightCentre(
                          'Bardhaman Agri Terminal (WB-BDN-01)',
                          'West Bengal — Rice Bowl',
                          '3,110 Q (77.8%)',
                          '15,600 / 20,000 Q (78.0%)',
                          31,
                          35,
                          '77.8%',
                          '78.0%',
                        )
                      }
                    >
                      <circle cx="560" cy="295" fill="#064e3b" r="5" stroke="#ffffff" strokeWidth="1.5"></circle>
                      <text fill="#064e3b" fontSize="9" fontWeight="bold" textAnchor="middle" x="560" y="312">
                        Bardhaman
                      </text>
                    </g>
                    {/* Southern Belt: Warangal Grain Hub */}
                    <g
                      className="cursor-pointer group"
                      onClick={() =>
                        highlightCentre(
                          'Warangal Agro Market (TS-WGL-03)',
                          'Telangana — North',
                          '2,450 Q (61.2%)',
                          '10,800 / 18,000 Q (60.0%)',
                          14,
                          22,
                          '61.2%',
                          '60.0%',
                        )
                      }
                    >
                      <circle cx="395" cy="460" fill="#064e3b" r="5" stroke="#ffffff" strokeWidth="1.5"></circle>
                      <text fill="#064e3b" fontSize="9" fontWeight="bold" textAnchor="middle" x="395" y="478">
                        Warangal Yard
                      </text>
                    </g>

                    {/* Map Legend overlay inside SVG */}
                    <rect
                      fill="#ffffff"
                      fillOpacity="0.9"
                      height="95"
                      rx="4"
                      stroke="#bfc9c3"
                      strokeWidth="1"
                      width="220"
                      x="25"
                      y="500"
                    ></rect>
                    <text fill="#003527" fontSize="11" fontWeight="bold" x="35" y="520">
                      CLUSTER LOGISTICS STATUS
                    </text>
                    <circle cx="45" cy="538" fill="#ba1a1a" r="4"></circle>
                    <text fill="#0d1c2f" fontSize="9" x="58" y="542">
                      Severe Congestion (TAT &gt; 90m)
                    </text>
                    <circle cx="45" cy="558" fill="#fe932c" r="4"></circle>
                    <text fill="#0d1c2f" fontSize="9" x="58" y="562">
                      Intense Intake (TAT 35-90m)
                    </text>
                    <circle cx="45" cy="578" fill="#064e3b" r="4"></circle>
                    <text fill="#0d1c2f" fontSize="9" x="58" y="582">
                      Optimal Logistics Flow (TAT &lt; 35m)
                    </text>
                  </svg>
                </div>

                {/* Bottom Live Stream Bar on Map */}
                <div className="px-space-md py-space-xs bg-surface-container-high border-t border-outline-variant/30 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                  <div className="flex items-center gap-space-sm">
                    <span className="inline-flex items-center gap-1 text-primary font-bold">
                      <span className="material-symbols-outlined text-[14px]">videocam</span> 18,410 CCTV Terminals Synced
                    </span>
                    <span>•</span>
                    <span>Weighbridge Calibration Audit: 100% Compliant</span>
                  </div>
                  <div className="font-data-mono">Projection: LCC-WGS84 | Geofence Enforced</div>
                </div>
              </div>

              {/* Interactive Centre Inspection Drawer (4 Cols on xl) */}
              <div className="xl:col-span-4 bg-surface-container-lowest flex flex-col justify-between">
                <div>
                  {/* Drawer Header */}
                  <div className="p-space-md border-b border-outline-variant/30 bg-surface-container-low flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-space-xs mb-1">
                        <span className="bg-primary text-on-primary font-label-sm text-label-sm px-space-xs py-[0.5px] rounded font-bold uppercase">
                          PINNED MANDI
                        </span>
                        <span className="font-data-mono text-data-mono text-outline font-bold">{centre.id}</span>
                      </div>
                      <h3 className="font-headline-md text-headline-md text-primary font-bold">{centre.name}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-outline">location_on</span>
                        {centre.region}
                      </p>
                    </div>
                    <span className="w-3 h-3 rounded-full bg-secondary-container" title="Operational Warning Status"></span>
                  </div>

                  {/* Operational Metrics Grid for Selected Mandi */}
                  <div className="p-space-md space-y-space-md">
                    <div className="grid grid-cols-3 gap-space-sm bg-surface-container-low p-space-sm rounded border border-outline-variant/30 text-center">
                      <div>
                        <div className="font-label-sm text-label-sm text-outline">Active Queue</div>
                        <div className="font-headline-md text-headline-md text-on-surface font-bold">{centre.queue}</div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">Tractors/Trucks</div>
                      </div>
                      <div className="border-l border-outline-variant/40">
                        <div className="font-label-sm text-label-sm text-outline">Est. Wait Time</div>
                        <div className="font-headline-md text-headline-md text-secondary font-bold">
                          {centre.wait} min
                        </div>
                        <div className="font-label-sm text-label-sm text-primary">Normal Velocity</div>
                      </div>
                      <div className="border-l border-outline-variant/40">
                        <div className="font-label-sm text-label-sm text-outline">Bookings Today</div>
                        <div className="font-headline-md text-headline-md text-primary font-bold">184</div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant">100% E-tokened</div>
                      </div>
                    </div>

                    {/* Detailed Capacity Gauges */}
                    <div className="space-y-space-sm">
                      {/* Daily Intake */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between font-label-sm text-label-sm">
                          <span className="font-bold text-on-surface">Daily Mandi Procurement Load</span>
                          <span className="font-data-mono font-bold text-primary">{centre.intake}</span>
                        </div>
                        <div className="w-full bg-surface-container h-2 rounded overflow-hidden">
                          <div className="bg-primary-container h-full rounded" style={{ width: centre.intakeBar }}></div>
                        </div>
                      </div>
                      {/* Silo Capacity */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between font-label-sm text-label-sm">
                          <span className="font-bold text-on-surface">Storage Silo Fill Ratio</span>
                          <span className="font-data-mono font-bold text-secondary">{centre.silo}</span>
                        </div>
                        <div className="w-full bg-surface-container h-2 rounded overflow-hidden">
                          <div className="bg-secondary-container h-full rounded" style={{ width: centre.siloBar }}></div>
                        </div>
                        <div className="font-label-sm text-label-sm text-secondary flex items-center gap-1 pt-0.5">
                          <span className="material-symbols-outlined text-[13px]">info</span>
                          <span>Approaching 80% Buffer threshold. Dispatch train requested.</span>
                        </div>
                      </div>
                    </div>

                    {/* Terminal Personnel & Infrastructure Status */}
                    <div className="border-t border-outline-variant/30 pt-space-sm space-y-space-xs text-on-surface font-body-sm text-body-sm">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Active Electronic Weighbridges:</span>
                        <span className="font-semibold text-primary font-data-mono">6 of 8 Weighbridges Online</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Assayer Quality Testing Kiosks:</span>
                        <span className="font-semibold text-on-surface font-data-mono">3 Stations Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Staff on Duty (Shifts A/B):</span>
                        <span className="font-semibold text-on-surface font-data-mono">14 Authorized Personnel</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Moisture Assayer Average:</span>
                        <span className="font-semibold text-primary font-data-mono">11.4% (Pass Standard &lt;12%)</span>
                      </div>
                    </div>

                    {/* Direct Farmer Queue Spotlight */}
                    <div className="bg-surface-container p-space-sm rounded border border-outline-variant/30">
                      <div className="font-label-sm text-label-sm uppercase font-bold text-outline mb-1">
                        Current Bay Slot 01 Assaying
                      </div>
                      <div className="flex items-center justify-between font-body-sm text-body-sm">
                        <div>
                          <div className="font-bold text-on-surface">S. Gurpreet Singh (PB-KAP-8910)</div>
                          <div className="text-on-surface-variant text-[11px]">
                            Tractor: PB-09-AK-3190 • 42.50 Quintals
                          </div>
                        </div>
                        <span className="bg-primary-fixed text-on-primary-fixed-variant px-space-xs py-[2px] rounded font-label-sm text-label-sm font-bold">
                          WEIGHED OK
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apex National Action Triggers for Selected Mandi */}
                <div className="p-space-md border-t border-outline-variant/30 bg-surface-container-low space-y-space-xs">
                  <button className="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-2 px-space-md rounded transition-colors flex items-center justify-center gap-space-xs font-semibold shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    Open Live CCTV & Weighbridge Stream
                  </button>
                  <div className="grid grid-cols-2 gap-space-xs">
                    <button className="bg-secondary hover:bg-secondary-fixed-dim text-on-secondary font-label-md text-label-md py-1.5 px-space-sm rounded transition-colors flex items-center justify-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[15px]">alt_route</span>
                      Initiate Demand Reroute
                    </button>
                    <button className="bg-surface-container-highest hover:bg-surface-dim text-on-surface font-label-md text-label-md py-1.5 px-space-sm rounded border border-outline-variant/50 transition-colors flex items-center justify-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[15px]">send</span>
                      Issue Directive
                    </button>
                  </div>
                </div>
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
                  State & Regional Procurement Matrix
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Cross-state comparative velocity, depot capacity pressure, and direct DBT clearing velocity.
                </p>
              </div>
              <div className="flex items-center gap-space-sm">
                <button className="bg-surface-container-lowest border border-outline-variant/50 hover:bg-surface-container text-on-surface font-label-md text-label-md px-space-md py-1 rounded transition-colors flex items-center gap-space-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">download</span> Export Sovereign Report
                </button>
                <button className="bg-surface-container-lowest border border-outline-variant/50 hover:bg-surface-container text-on-surface font-label-md text-label-md px-space-md py-1 rounded transition-colors flex items-center gap-space-xs font-semibold">
                  <span className="material-symbols-outlined text-[16px]">tune</span> Column Config
                </button>
              </div>
            </div>

            {/* High-Density Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/50 text-outline font-label-md text-label-md uppercase tracking-wider">
                    <th className="py-space-sm px-gutter font-bold">Jurisdiction / State (Cluster Sub-zones)</th>
                    <th className="py-space-sm px-space-md font-bold text-center">Active Mandis</th>
                    <th className="py-space-sm px-space-md font-bold text-right">Intake Today (Quintals)</th>
                    <th className="py-space-sm px-space-md font-bold text-center">Avg Depot Wait</th>
                    <th className="py-space-sm px-space-md font-bold">Storage Silo Occupancy</th>
                    <th className="py-space-sm px-space-md font-bold text-right">DBT Clearance Rate</th>
                    <th className="py-space-sm px-space-md font-bold text-center">Grid Operational Status</th>
                    <th className="py-space-sm px-gutter font-bold text-right">Direct Protocol Actions</th>
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
                      <td
                        className={`py-space-sm px-space-md text-right font-data-mono font-bold ${row.intakeCls || 'text-primary'}`}
                      >
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
                              className={`${row.siloCls} h-full rounded ${row.silo === 82 ? 'font-bold text-error' : ''}`}
                              style={{ width: `${row.silo}%` }}
                            ></div>
                          </div>
                          <span
                            className={`font-data-mono text-data-mono font-semibold ${row.silo === 82 ? 'font-bold text-error' : ''}`}
                          >
                            {row.silo}%
                          </span>
                        </div>
                      </td>
                      <td
                        className={`py-space-sm px-space-md text-right font-data-mono font-semibold ${row.dbtCls || 'text-primary'}`}
                      >
                        {row.dbt}{' '}
                        <span className={`text-[11px] font-normal ${row.dbtNoteCls || 'text-outline'}`}>
                          {row.dbtNote}
                        </span>
                      </td>
                      <td className="py-space-sm px-space-md text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-space-sm py-[2px] rounded-full border font-label-sm text-label-sm font-bold ${row.statusCls}`}
                        >
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

            {/* Table Footer / Sovereign Summary Bar */}
            <div className="px-gutter py-space-sm bg-surface-container border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <div className="flex items-center gap-space-sm">
                <span>Displaying Top 5 Strategic States (2,120 of 2,480 National Mandis)</span>
                <span>•</span>
                <span className="text-primary font-bold">National Aggregation: Kharif/Rabi Dual Active</span>
              </div>
              <div className="flex items-center gap-space-xs mt-2 sm:mt-0 font-data-mono">
                <span>Server Response: 19ms</span>
                <span className="text-outline-variant">|</span>
                <span>Official Timestamp: 14:48:02 IST</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}
