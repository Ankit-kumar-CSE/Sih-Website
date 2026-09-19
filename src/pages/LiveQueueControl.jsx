import { useCallback, useEffect, useRef, useState } from 'react'
import AppShell from '../components/AppShell'
import { useAdminAuth } from '../store/adminAuth'
import { adminFetch } from '../hooks/useApi'

const QUEUE_ROWS = [
  {
    token: 'A-104',
    name: 'Balwinder Kaur',
    fid: 'KRN-PB-88219 • Ranipur',
    crop: 'Wheat (PBW 725)',
    qty: '120 Quintals',
    qtyCls: 'text-secondary font-bold',
    slot: '10:30 – 11:30',
    slotNote: 'On Schedule',
    slotNoteCls: 'text-surface-tint font-bold',
    arrival: '10:18 AM',
    wait: 'Wait: 24m',
    waitCls: 'text-secondary font-bold',
    counter: 'Target: Counter 7',
    counterCls: 'bg-secondary text-on-secondary font-bold',
    status: 'Gate In Verified',
    statusDot: 'bg-surface-tint',
    statusCls: 'bg-surface-tint/10 text-surface-tint',
    rowCls: 'bg-secondary-fixed/10 hover:bg-secondary-fixed/20',
    next: true,
  },
  {
    token: 'A-105',
    name: 'Paramjit Singh',
    fid: 'KRN-PB-90112 • Palahi',
    crop: 'Wheat (HD 3086)',
    qty: '95 Quintals',
    qtyCls: 'text-on-surface font-bold',
    slot: '10:30 – 11:30',
    slotNote: 'Late Arrival (10m)',
    slotNoteCls: 'text-outline',
    arrival: '10:22 AM',
    wait: 'Wait: 20m',
    waitCls: 'text-outline',
    counter: 'Counter 05',
    counterCls: 'bg-surface-container-high text-on-surface font-bold',
    status: 'Document Check',
    statusDot: 'bg-primary',
    statusCls: 'bg-surface-container-high text-on-surface-variant',
    rowCls: 'hover:bg-surface-container-low',
    next: false,
  },
  {
    token: 'A-106',
    name: 'Gurdev Singh',
    fid: 'KRN-PB-43190 • Madhopur',
    crop: 'Paddy (Basmati 1121)',
    qty: '60 Quintals',
    qtyCls: 'text-on-surface font-bold',
    slot: '11:00 – 12:00',
    slotNote: 'Early Arrival',
    slotNoteCls: 'text-surface-tint font-bold',
    arrival: '10:35 AM',
    wait: 'Wait: 7m',
    waitCls: 'text-outline',
    counter: 'Counter 06',
    counterCls: 'bg-surface-container-high text-on-surface font-bold',
    status: 'Unloading Bay 3',
    statusDot: 'bg-secondary-container animate-pulse',
    statusCls: 'bg-surface-container-highest text-primary-container',
    rowCls: 'hover:bg-surface-container-low',
    next: false,
  },
  {
    token: 'A-107',
    name: 'Kuldeep Chahal',
    fid: 'KRN-PB-10492 • Chiheru',
    crop: 'Wheat (Unnat PBW 343)',
    qty: '150 Quintals',
    qtyCls: 'text-primary font-bold',
    slot: '11:00 – 12:00',
    slotNote: 'On Schedule',
    slotNoteCls: 'text-surface-tint font-bold',
    arrival: '10:40 AM',
    wait: 'Wait: 2m',
    waitCls: 'text-outline',
    counter: 'Waiting Area A',
    counterCls: 'text-outline italic',
    status: 'Gate In Verified',
    statusDot: 'bg-surface-tint',
    statusCls: 'bg-surface-tint/10 text-surface-tint',
    rowCls: 'hover:bg-surface-container-low',
    next: false,
  },
  {
    token: 'A-108',
    name: 'Davinder Sandhu',
    fid: 'KRN-PB-77412 • Hadiabad',
    crop: 'Mustard (Pusa Bold)',
    qty: '45 Quintals',
    qtyCls: 'text-on-surface font-bold',
    slot: '11:00 – 12:00',
    slotNote: 'On Schedule',
    slotNoteCls: 'text-surface-tint font-bold',
    arrival: '10:41 AM',
    wait: 'Wait: 1m',
    waitCls: 'text-outline',
    counter: 'Waiting Area B',
    counterCls: 'text-outline italic',
    status: 'Gate In Verified',
    statusDot: 'bg-surface-tint',
    statusCls: 'bg-surface-tint/10 text-surface-tint',
    rowCls: 'hover:bg-surface-container-low',
    next: false,
  },
]

const QUEUE_TABS = [
  { label: 'All Waiting (34)' },
  { label: 'Processing (6)' },
  { label: 'Verified Gate-In (12)' },
  { label: 'Completed (142)' },
  { label: 'Exceptions (3)', error: true },
]

export default function LiveQueueControl() {
  const { token, apiBase, admin } = useAdminAuth()
  const centreId = admin?.centreId || 'KR-PHK-01'

  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [nextToken, setNextToken] = useState('A-104')
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [liveQueue, setLiveQueue] = useState(null)   // null = not yet loaded
  const [callingNext, setCallingNext] = useState(false)
  const toastTimer = useRef(null)

  const showToast = (msg) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => clearTimeout(toastTimer.current), [])

  // Fetch queue from backend and refresh every 10 seconds
  const loadQueue = useCallback(async () => {
    try {
      const data = await adminFetch(apiBase, token, `/api/operator/queue?centreId=${centreId}`)
      if (data?.queue) setLiveQueue(data.queue)
    } catch {
      // Backend unavailable — show static demo rows below
    }
  }, [apiBase, token, centreId])

  useEffect(() => {
    loadQueue()
    const interval = setInterval(loadQueue, 10000)
    return () => clearInterval(interval)
  }, [loadQueue])

  const confirmDispatch = async () => {
    setModalOpen(false)
    setCallingNext(true)
    try {
      await adminFetch(apiBase, token, '/api/operator/queue/next', {
        method: 'POST',
        body: { centreId },
      })
      await loadQueue()  // refresh
      showToast(`Next token called. Queue advanced.`)
    } catch (err) {
      showToast('Could not call next: ' + err.message)
    } finally {
      setCallingNext(false)
    }
  }

  const simulateAction = (actionName) => {
    showToast('Action registered: ' + actionName + ' - Operator Logged')
  }

  const simulateExport = () => {
    showToast('Downloading live CSV manifest for Phagwara Mandi PB-KAP-102...')
  }

  // Map live API bookings to the same shape the UI expects
  const apiRows = liveQueue
    ? liveQueue.map((b, i) => ({
        token: b.token || `A-${b.token_num}`,
        name: b.farmer_name || b.farmerName || 'Farmer',
        fid: b.booking_id || b.bookingId || '',
        crop: b.crop,
        qty: `${b.quantity} Quintals`,
        qtyCls: i === 0 ? 'text-secondary font-bold' : 'text-on-surface font-bold',
        slot: b.slot_label || b.slotLabel || '',
        slotNote: 'On Schedule',
        slotNoteCls: 'text-surface-tint font-bold',
        arrival: b.checked_in_at ? new Date(b.checked_in_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Pending',
        wait: `Wait: —`,
        waitCls: 'text-outline',
        counter: `Queue Pos. ${i + 1}`,
        counterCls: i === 0 ? 'bg-secondary text-on-secondary font-bold' : 'bg-surface-container-high text-on-surface font-bold',
        status: b.status === 'checked-in' ? 'Gate In Verified' : b.status === 'in-queue' ? 'Counter Queue' : b.status,
        statusDot: 'bg-surface-tint',
        statusCls: 'bg-surface-tint/10 text-surface-tint',
        rowCls: i === 0 ? 'bg-secondary-fixed/10 hover:bg-secondary-fixed/20' : 'hover:bg-surface-container-low',
        next: i === 0,
      }))
    : null

  // Use API rows if available, fallback to static demo rows
  const displayRows = apiRows || QUEUE_ROWS

  const filteredRows = displayRows.filter((row) => {
    if (!searchQuery.trim()) return true
    const text = `${row.token} ${row.name} ${row.fid} ${row.crop} ${row.qty}`.toLowerCase()
    return text.includes(searchQuery.toLowerCase())
  })

  return (
    <AppShell>
      <div className="flex flex-col w-full space-y-space-md">
        {/* MANDI CONTEXT BANNER & OPERATIONAL HEADER */}
        <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-wrap items-center gap-space-md">
            <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[24px]">point_of_sale</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="font-headline-md text-headline-md text-on-surface">
                  Phagwara Main Mandi Command
                </span>
                <span className="bg-primary-container text-on-primary font-label-sm text-label-sm px-space-xs py-[2px] rounded">
                  PB-KAP-102
                </span>
                <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-space-xs py-[2px] rounded">
                  Punjab — Doaba Zone
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-space-md mt-space-xs font-body-sm text-body-sm text-on-surface-variant">
                <span className="flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                  Operator On Duty: <strong className="text-on-surface font-label-md">Gurpreet Singh (OP-4492)</strong>
                </span>
                <span className="text-outline-variant">•</span>
                <span>
                  District: <span className="font-bold text-on-surface">Kapurthala Apex Yard</span>
                </span>
                <span className="text-outline-variant">•</span>
                <span className="text-primary font-bold">6 of 8 Counters Active</span>
              </div>
            </div>
          </div>
          {/* Live Telemetry Badge Group */}
          <div className="flex flex-wrap items-center gap-space-sm bg-surface-container-low p-space-sm rounded-lg">
            <div className="px-space-sm py-space-xs bg-surface-container-lowest rounded shadow-sm">
              <div className="font-label-sm text-label-sm text-outline uppercase tracking-wider">STREAM STATUS</div>
              <div className="font-data-mono text-data-mono font-bold text-primary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-ping"></span>
                LIVE (2s latency)
              </div>
            </div>
            <div className="px-space-sm py-space-xs bg-surface-container-lowest rounded shadow-sm">
              <div className="font-label-sm text-label-sm text-outline uppercase tracking-wider">AVG WAIT</div>
              <div className="font-data-mono text-data-mono font-bold text-on-surface">28 Min</div>
            </div>
            <div className="px-space-sm py-space-xs bg-surface-container-lowest rounded shadow-sm">
              <div className="font-label-sm text-label-sm text-outline uppercase tracking-wider">INTAKE VELOCITY</div>
              <div className="font-data-mono text-data-mono font-bold text-secondary">14.2 Farmers/Hr</div>
            </div>
          </div>
        </div>

        {/* FLAGSHIP CALL HERO BANNER */}
        <div className="bg-primary text-on-primary rounded-lg shadow-md p-space-lg relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-primary-container/40 pointer-events-none blur-2xl"></div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-center relative z-10">
            {/* Current Serving Token Unit */}
            <div className="xl:col-span-4 bg-primary-container/70 p-space-md rounded-lg flex flex-col justify-between">
              <div className="flex items-center justify-between font-label-sm text-label-sm text-primary-fixed-dim uppercase tracking-wider mb-space-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                  ACTIVE INGESTION
                </span>
                <span className="font-data-mono bg-primary px-space-xs py-[1px] rounded text-primary-fixed">
                  BAY 02 / C-02
                </span>
              </div>
              <div className="flex items-baseline gap-space-md my-space-xs">
                <span className="font-headline-xl text-[44px] leading-none font-bold text-on-primary tracking-tight">
                  A-103
                </span>
                <div className="min-w-0">
                  <div className="font-headline-sm text-headline-sm text-on-primary truncate">Harinder Singh</div>
                  <div className="font-body-sm text-body-sm text-primary-fixed-dim">ID: KRN-PB-66321 • Ranipur</div>
                </div>
              </div>
              <div className="pt-space-sm mt-space-sm bg-primary/40 -mx-space-md -mb-space-md p-space-md rounded-b-lg flex items-center justify-between text-primary-fixed-dim font-label-sm text-label-sm">
                <span>
                  Wheat Sharbati • <strong className="text-on-primary font-bold">85 Q</strong>
                </span>
                <span className="bg-secondary-container text-on-secondary-container px-space-xs py-[2px] rounded font-bold font-label-sm text-label-sm">
                  Stage: Assaying / QC
                </span>
              </div>
            </div>

            {/* Center Action Trigger & Farmer Notification Preview */}
            <div className="xl:col-span-5 flex flex-col items-start gap-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="bg-secondary text-on-secondary px-space-xs py-[2px] rounded font-label-sm text-label-sm font-bold tracking-widest uppercase">
                  IMMEDIATE QUEUE DISPATCH
                </span>
                <span className="text-primary-fixed-dim font-label-sm text-label-sm">
                  ● Target: Open Bay Counter 07
                </span>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-secondary hover:bg-secondary/90 active:scale-[0.99] text-on-secondary px-space-lg py-space-md rounded-lg shadow-lg flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-space-md text-left">
                  <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">
                    campaign
                  </span>
                  <div>
                    <div className="font-headline-md text-headline-md font-bold tracking-wide flex items-center gap-2">
                      <span>CALL NEXT FARMER: {nextToken}</span>
                      <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </div>
                    <div className="font-label-sm text-label-sm text-on-secondary/90 tracking-tight">
                      Auto-broadcasts Hindi/Punjabi Audio Chime + Push Notification + SMS
                    </div>
                  </div>
                </div>
                <span className="bg-on-secondary text-secondary font-data-mono text-data-mono font-bold px-space-sm py-space-xs rounded shadow-sm hidden sm:inline-block">
                  BAY 7 ALLOCATED
                </span>
              </button>
              <div className="flex flex-wrap items-center gap-space-xs w-full pt-space-xs">
                <button
                  onClick={() => simulateAction('Hold')}
                  className="px-space-md py-space-xs rounded bg-primary-container text-primary-fixed hover:bg-primary-container/80 font-label-md text-label-md flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">pause_circle</span>Hold {nextToken}
                </button>
                <button
                  onClick={() => simulateAction('Skip')}
                  className="px-space-md py-space-xs rounded bg-primary-container text-primary-fixed hover:bg-primary-container/80 font-label-md text-label-md flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">skip_next</span>Skip to A-105
                </button>
                <button
                  onClick={() => simulateAction('Recall')}
                  className="px-space-md py-space-xs rounded bg-primary-container text-primary-fixed hover:bg-primary-container/80 font-label-md text-label-md flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">replay</span>Recall A-103
                </button>
                <button
                  onClick={() => simulateAction('Walk-in Check-in')}
                  className="px-space-md py-space-xs rounded bg-surface-container-highest text-on-surface font-label-md text-label-md flex items-center gap-1 hover:bg-surface-container-high transition-colors ml-auto"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>Walk-In Check-In
                </button>
              </div>
            </div>

            {/* Up Next Card */}
            <div className="xl:col-span-3 bg-surface-container-lowest text-on-surface p-space-md rounded-lg shadow-sm">
              <div className="flex items-center justify-between font-label-sm text-label-sm text-outline uppercase tracking-wider mb-space-xs">
                <span>QUEUED #1 ON DECK</span>
                <span className="text-secondary font-bold font-data-mono">SLOT 10:30</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-headline-lg text-headline-lg font-bold text-on-surface">{nextToken}</div>
                  <div className="font-label-lg text-label-lg text-on-surface font-bold">Balwinder Kaur</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Village Ranipur • PBW 725</div>
                </div>
                <div className="text-right">
                  <span className="font-headline-md text-headline-md font-bold text-primary">120 Q</span>
                  <div className="font-label-sm text-label-sm text-outline">Tractor PB-09-AH</div>
                </div>
              </div>
              <div className="mt-space-sm pt-space-xs bg-surface-container-low px-space-xs py-space-xs rounded flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-surface-tint text-[14px]">check_circle</span>
                  Gate-In Verified
                </span>
                <span className="font-data-mono text-outline">Waited: 24m</span>
              </div>
            </div>
          </div>
        </div>

        {/* OPERATIONAL KPI GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
          {/* Card 1 */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">WAITING IN QUEUE</span>
              <span className="material-symbols-outlined text-primary text-[18px]">group</span>
            </div>
            <div className="my-space-xs flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold">34</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Farmers</span>
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between">
              <span>
                Est. clear: <strong className="font-data-mono text-on-surface">13:45</strong>
              </span>
              <span className="text-primary font-bold">Avg 28m</span>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                ACTIVE PROCESSING
              </span>
              <span className="material-symbols-outlined text-secondary text-[18px]">sync_alt</span>
            </div>
            <div className="my-space-xs flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold">6</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Across Bays 1-6</span>
            </div>
            <div className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Counter 4 requires assayer
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">CLEARED TODAY</span>
              <span className="material-symbols-outlined text-surface-tint text-[18px]">task_alt</span>
            </div>
            <div className="my-space-xs flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl text-primary font-bold">142</span>
              <span className="font-label-sm text-label-sm text-outline">Dispatches</span>
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">
              Net: <span className="font-bold text-on-surface">3,420 Quintals</span> passed
            </div>
          </div>
          {/* Card 4 */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                EXCEPTIONS / NO-SHOW
              </span>
              <span className="material-symbols-outlined text-error text-[18px]">warning</span>
            </div>
            <div className="my-space-xs flex items-baseline gap-space-sm">
              <span className="font-headline-xl text-headline-xl text-error font-bold">3</span>
              <span className="font-label-sm text-label-sm text-outline">Flagged</span>
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant truncate">
              Auto-reschedule window active
            </div>
          </div>
          {/* Card 5 */}
          <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                DAILY MSP CAPACITY
              </span>
              <span className="font-data-mono text-data-mono text-primary font-bold">85.5%</span>
            </div>
            <div className="my-space-xs">
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '85.5%' }}></div>
              </div>
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-between">
              <span>3,420 Q</span>
              <span className="text-outline">Max: 4,000 Q</span>
            </div>
          </div>
        </div>

        {/* LIVE COUNTER STATUS BOARD (8 COUNTERS GRID) */}
        <div className="bg-surface-container-lowest rounded-lg shadow-sm p-space-md flex flex-col space-y-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  Live Counter & Bay Allocation Grid
                </span>
                <span className="bg-primary-container/10 text-primary-container px-space-xs py-[1px] rounded font-label-sm text-label-sm font-bold">
                  8 Dedicated Bays
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Real-time terminal sync: weighing bridges, moisture sensors, and Aadhaar e-KYC stations.
              </p>
            </div>
            <div className="flex items-center gap-space-sm font-label-sm text-label-sm">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-surface-tint"></span>Active (6)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>Slow/Hold (1)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-secondary-container"></span>Standby (1)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-outline"></span>Offline (1)
              </span>
            </div>
          </div>

          {/* 8 Counter Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Counter 1 */}
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col justify-between hover:bg-surface-container-high transition-colors">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">COUNTER 01</span>
                  </div>
                  <span className="bg-surface-container-lowest text-surface-tint font-label-sm text-label-sm font-bold px-space-xs rounded">
                    ACTIVE
                  </span>
                </div>
                <div className="font-body-sm text-body-sm text-outline">OP: Manpreet Kaur</div>
                <div className="mt-space-sm bg-surface-container-lowest p-space-xs rounded shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">A-101</span>
                    <span className="font-data-mono text-label-sm text-outline">8m on bay</span>
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    Final Weighment Gross
                  </div>
                  <div className="font-data-mono text-data-mono font-bold text-on-surface">14,200 kg Gross</div>
                </div>
              </div>
              <div className="mt-space-xs pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span>Weighbridge Bay #1</span>
                <span className="text-surface-tint font-bold">Stable</span>
              </div>
            </div>
            {/* Counter 2 */}
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col justify-between hover:bg-surface-container-high transition-colors">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">COUNTER 02</span>
                  </div>
                  <span className="bg-surface-container-lowest text-surface-tint font-label-sm text-label-sm font-bold px-space-xs rounded">
                    ACTIVE
                  </span>
                </div>
                <div className="font-body-sm text-body-sm text-outline">OP: Gurpreet Singh (Lead)</div>
                <div className="mt-space-sm bg-surface-container-lowest p-space-xs rounded shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">A-103</span>
                    <span className="font-data-mono text-label-sm text-outline">4m on bay</span>
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    Moisture & Quality Grading
                  </div>
                  <div className="font-data-mono text-data-mono font-bold text-primary">Grade A (11.8% Moist)</div>
                </div>
              </div>
              <div className="mt-space-xs pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span>Assay Lab Delta 2</span>
                <span className="text-primary font-bold">Passing</span>
              </div>
            </div>
            {/* Counter 3 */}
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col justify-between hover:bg-surface-container-high transition-colors">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">COUNTER 03</span>
                  </div>
                  <span className="bg-surface-container-lowest text-surface-tint font-label-sm text-label-sm font-bold px-space-xs rounded">
                    ACTIVE
                  </span>
                </div>
                <div className="font-body-sm text-body-sm text-outline">OP: Rajesh Kumar</div>
                <div className="mt-space-sm bg-surface-container-lowest p-space-xs rounded shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">A-102</span>
                    <span className="font-data-mono text-label-sm text-outline">11m on bay</span>
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    DBT Bank Clearing & KYC
                  </div>
                  <div className="font-data-mono text-data-mono font-bold text-secondary">Aadhaar Linked - Valid</div>
                </div>
              </div>
              <div className="mt-space-xs pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span>PFMS Portal Sync</span>
                <span className="text-surface-tint font-bold">Synced</span>
              </div>
            </div>
            {/* Counter 4 (BUSY / SLOW / FLAGGED) */}
            <div className="bg-error-container/20 p-space-sm rounded-lg flex flex-col justify-between hover:bg-error-container/30 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                    <span className="font-label-lg text-label-lg font-bold text-error">COUNTER 04</span>
                  </div>
                  <span className="bg-error text-on-error font-label-sm text-label-sm font-bold px-space-xs rounded">
                    FLAGGED SLOW
                  </span>
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">OP: Harjit Singh</div>
                <div className="mt-space-sm bg-surface-container-lowest p-space-xs rounded shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-headline-sm font-bold text-error">A-99</span>
                    <span className="font-data-mono text-label-sm text-error font-bold">19m (Over avg)</span>
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    Discrepancy Reconciliation
                  </div>
                  <div className="font-data-mono text-data-mono font-bold text-error">-2 bags tare weight check</div>
                </div>
              </div>
              <div className="mt-space-xs pt-space-xs flex items-center justify-between text-error font-label-sm text-label-sm">
                <span>Supervisor Alert Sent</span>
                <button
                  onClick={() => simulateAction('Reconcile C4')}
                  className="text-secondary font-bold underline"
                >
                  Assist
                </button>
              </div>
            </div>
            {/* Counter 5 */}
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col justify-between hover:bg-surface-container-high transition-colors">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">COUNTER 05</span>
                  </div>
                  <span className="bg-surface-container-lowest text-surface-tint font-label-sm text-label-sm font-bold px-space-xs rounded">
                    ACTIVE
                  </span>
                </div>
                <div className="font-body-sm text-body-sm text-outline">OP: Sunita Devi</div>
                <div className="mt-space-sm bg-surface-container-lowest p-space-xs rounded shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">A-105</span>
                    <span className="font-data-mono text-label-sm text-outline">2m on bay</span>
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    Token & Gate Pass Review
                  </div>
                  <div className="font-data-mono text-data-mono font-bold text-on-surface">Wheat (HD 3086) 95 Q</div>
                </div>
              </div>
              <div className="mt-space-xs pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span>Inward Station 01</span>
                <span className="text-surface-tint font-bold">Fast Moving</span>
              </div>
            </div>
            {/* Counter 6 */}
            <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col justify-between hover:bg-surface-container-high transition-colors">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-surface-tint"></span>
                    <span className="font-label-lg text-label-lg font-bold text-on-surface">COUNTER 06</span>
                  </div>
                  <span className="bg-surface-container-lowest text-surface-tint font-label-sm text-label-sm font-bold px-space-xs rounded">
                    ACTIVE
                  </span>
                </div>
                <div className="font-body-sm text-body-sm text-outline">OP: Jasbir Singh</div>
                <div className="mt-space-sm bg-surface-container-lowest p-space-xs rounded shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-sm text-headline-sm font-bold text-primary">A-106</span>
                    <span className="font-data-mono text-label-sm text-outline">6m on bay</span>
                  </div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    Produce Unloading Conveyor
                  </div>
                  <div className="font-data-mono text-data-mono font-bold text-on-surface">Basmati 1121 • 60 Q</div>
                </div>
              </div>
              <div className="mt-space-xs pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span>Shed B Unloading</span>
                <span className="text-primary font-bold">Bay In Use</span>
              </div>
            </div>
            {/* Counter 7 (STANDBY / TARGET OF NEXT CALL) */}
            <div className="bg-secondary-fixed/30 p-space-sm rounded-lg flex flex-col justify-between hover:bg-secondary-fixed/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                    <span className="font-label-lg text-label-lg font-bold text-secondary">COUNTER 07</span>
                  </div>
                  <span className="bg-secondary text-on-secondary font-label-sm text-label-sm font-bold px-space-xs rounded">
                    IDLE / READY
                  </span>
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">OP: Sukhdev Ram</div>
                <div className="mt-space-sm bg-surface-container-lowest p-space-xs rounded shadow-xs text-center py-space-sm">
                  <div className="font-label-sm text-label-sm text-outline uppercase">AVAILABLE FOR DISPATCH</div>
                  <div className="font-headline-sm text-headline-sm font-bold text-secondary mt-1">
                    Direct Next Token Here
                  </div>
                </div>
              </div>
              <div className="mt-space-xs pt-space-xs flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-outline">Weighbridge Clear</span>
                <button
                  onClick={() => setModalOpen(true)}
                  className="font-label-sm text-label-sm bg-secondary text-on-secondary px-space-xs py-[2px] rounded font-bold hover:bg-secondary/90"
                >
                  Dispatch
                </button>
              </div>
            </div>
            {/* Counter 8 (OFFLINE / CALIBRATION) */}
            <div className="bg-surface-container p-space-sm rounded-lg flex flex-col justify-between opacity-80">
              <div>
                <div className="flex items-center justify-between mb-space-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-outline"></span>
                    <span className="font-label-lg text-label-lg font-bold text-outline">COUNTER 08</span>
                  </div>
                  <span className="bg-surface-container-highest text-outline font-label-sm text-label-sm font-bold px-space-xs rounded">
                    OFFLINE
                  </span>
                </div>
                <div className="font-body-sm text-body-sm text-outline">Tech: Calibration Team</div>
                <div className="mt-space-sm bg-surface-container-lowest/60 p-space-xs rounded shadow-xs">
                  <div className="font-label-sm text-label-sm text-outline uppercase">MAINTENANCE CYCLE</div>
                  <div className="font-body-sm text-body-sm text-on-surface font-bold mt-1">
                    Weighbridge Sensor Tare Calib
                  </div>
                  <div className="font-data-mono text-label-sm text-outline">Est. Ready: 15 mins</div>
                </div>
              </div>
              <div className="mt-space-xs pt-space-xs flex items-center justify-between text-outline font-label-sm text-label-sm">
                <span>ISO Calibration Protocol</span>
                <span className="font-data-mono">Stage 2/3</span>
              </div>
            </div>
          </div>
        </div>

        {/* MASTER LIVE QUEUE TABLE & CONTROLS */}
        <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
          {/* Table Header Toolbar */}
          <div className="p-space-md bg-surface-container-low flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            {/* Tab Strip */}
            <div className="flex flex-wrap items-center gap-space-xs">
              {QUEUE_TABS.map((tab, idx) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(idx)}
                  className={`px-space-md py-space-xs rounded font-label-md text-label-md transition-colors flex items-center gap-1 ${
                    activeTab === idx
                      ? 'bg-primary text-on-primary font-bold shadow-xs'
                      : `bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high ${tab.error ? 'text-error' : ''}`
                  }`}
                >
                  {tab.error && <span className="w-1.5 h-1.5 rounded-full bg-error"></span>}
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Quick Search & Advanced Filters */}
            <div className="flex items-center gap-space-sm">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-space-xs top-1.5 text-outline text-[16px] pointer-events-none">
                  search
                </span>
                <input
                  className="h-8 pl-7 pr-space-sm bg-surface-container-lowest rounded text-on-surface text-body-sm font-body-sm focus:outline-none focus:ring-1 focus:ring-primary w-48 sm:w-64"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter Farmer, Token or Crop..."
                  type="text"
                  value={searchQuery}
                />
              </div>
              <button className="h-8 px-space-sm bg-surface-container-lowest hover:bg-surface-container-high rounded text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span className="hidden sm:inline">Filters</span>
              </button>
              <button
                onClick={simulateExport}
                className="h-8 px-space-sm bg-surface-container-lowest hover:bg-surface-container-high rounded text-on-surface font-label-md text-label-md flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Data Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-outline font-label-md text-label-md uppercase tracking-wider">
                  <th className="py-space-sm px-space-md">Token #</th>
                  <th className="py-space-sm px-space-md">Farmer Identity & ID</th>
                  <th className="py-space-sm px-space-md">Crop & Declared Qty</th>
                  <th className="py-space-sm px-space-md">Slot Window</th>
                  <th className="py-space-sm px-space-md">Arrival & Wait</th>
                  <th className="py-space-sm px-space-md">Assigned Counter</th>
                  <th className="py-space-sm px-space-md">Status Stage</th>
                  <th className="py-space-sm px-space-md text-right">Operational Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-body-md font-body-md">
                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-space-lg text-center text-outline font-body-sm">
                      No waiting farmers match "{searchQuery}"
                    </td>
                  </tr>
                )}
                {filteredRows.map((row) => (
                  <tr key={row.token} className={`${row.rowCls} transition-colors`}>
                    <td className="py-space-sm px-space-md">
                      {row.next ? (
                        <span className="font-headline-sm text-headline-sm font-bold text-secondary bg-surface-container-lowest px-space-xs py-[2px] rounded shadow-xs">
                          {row.token}
                        </span>
                      ) : (
                        <span
                          className={`font-headline-sm text-headline-sm font-bold ${row.token === 'A-108' || row.token === 'A-107' ? 'text-on-surface' : 'text-primary'}`}
                        >
                          {row.token}
                        </span>
                      )}
                    </td>
                    <td className="py-space-sm px-space-md">
                      <div className="font-label-lg text-label-lg font-bold text-on-surface">{row.name}</div>
                      <div className="font-data-mono text-data-mono text-outline">{row.fid}</div>
                    </td>
                    <td className="py-space-sm px-space-md">
                      <div className="font-label-md text-label-md font-bold text-on-surface">{row.crop}</div>
                      <div className={`font-data-mono text-data-mono ${row.qtyCls}`}>{row.qty}</div>
                    </td>
                    <td className="py-space-sm px-space-md">
                      <div className="font-data-mono text-data-mono">{row.slot}</div>
                      <span className={`font-label-sm text-label-sm ${row.slotNoteCls}`}>{row.slotNote}</span>
                    </td>
                    <td className="py-space-sm px-space-md">
                      <div className="font-data-mono text-data-mono">{row.arrival}</div>
                      <div className={`font-label-sm text-label-sm ${row.waitCls}`}>{row.wait}</div>
                    </td>
                    <td className="py-space-sm px-space-md">
                      <span
                        className={`px-space-xs py-[2px] rounded font-label-sm text-label-sm ${row.counterCls}`}
                      >
                        {row.counter}
                      </span>
                    </td>
                    <td className="py-space-sm px-space-md">
                      <span
                        className={`inline-flex items-center gap-1 px-space-xs py-[2px] rounded font-label-sm text-label-sm font-bold ${row.statusCls}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${row.statusDot}`}></span>
                        {row.status}
                      </span>
                    </td>
                    <td className="py-space-sm px-space-md text-right">
                      <div className="flex items-center justify-end gap-space-xs">
                        {row.next && (
                          <button
                            onClick={() => setModalOpen(true)}
                            className="bg-secondary hover:bg-secondary/90 text-on-secondary px-space-sm py-space-xs rounded font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[14px]">campaign</span>Call Next
                          </button>
                        )}
                        {row.token === 'A-104' && (
                          <button
                            onClick={() => simulateAction('Assign Counter 7')}
                            className="bg-surface-container-lowest hover:bg-surface-container-high text-on-surface px-space-sm py-space-xs rounded font-label-sm text-label-sm font-bold"
                          >
                            Assign
                          </button>
                        )}
                        {row.token === 'A-105' && (
                          <button
                            onClick={() => simulateAction('View Docs A-105')}
                            className="bg-surface-container-lowest hover:bg-surface-container-high text-on-surface px-space-sm py-space-xs rounded font-label-sm text-label-sm font-bold"
                          >
                            View Docs
                          </button>
                        )}
                        {row.token === 'A-106' && (
                          <button
                            onClick={() => simulateAction('Track Bay A-106')}
                            className="bg-surface-container-lowest hover:bg-surface-container-high text-on-surface px-space-sm py-space-xs rounded font-label-sm text-label-sm font-bold"
                          >
                            Track Bay
                          </button>
                        )}
                        {row.token === 'A-107' && (
                          <button
                            onClick={() => simulateAction('Promote A-107')}
                            className="bg-surface-container-lowest hover:bg-surface-container-high text-on-surface px-space-sm py-space-xs rounded font-label-sm text-label-sm font-bold"
                          >
                            Call Next
                          </button>
                        )}
                        {row.token === 'A-108' && (
                          <button
                            onClick={() => simulateAction('Queue Details A-108')}
                            className="bg-surface-container-lowest hover:bg-surface-container-high text-on-surface px-space-sm py-space-xs rounded font-label-sm text-label-sm font-bold"
                          >
                            Queue Details
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination & Mandi Quota Status */}
          <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
            <div className="flex items-center gap-space-md">
              <span>
                Showing <strong>{filteredRows.length}</strong> of <strong>34</strong> waiting farmers
              </span>
              <span className="text-outline-variant">|</span>
              <span className="text-primary font-bold">Kharif MSP 2025 Mandi Quota Guaranteed</span>
            </div>
            <div className="flex items-center gap-space-xs font-label-md text-label-md">
              <button className="px-space-sm py-1 rounded bg-surface-container-lowest text-outline cursor-not-allowed">
                Previous
              </button>
              <button className="px-space-sm py-1 rounded bg-primary text-on-primary font-bold">1</button>
              <button className="px-space-sm py-1 rounded bg-surface-container-lowest hover:bg-surface-container-high text-on-surface">
                2
              </button>
              <button className="px-space-sm py-1 rounded bg-surface-container-lowest hover:bg-surface-container-high text-on-surface">
                3
              </button>
              <button className="px-space-sm py-1 rounded bg-surface-container-lowest hover:bg-surface-container-high text-on-surface">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* SIH DEMO NOTIFICATION & SIMULATION DRAWER / MODAL OVERLAY */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-on-surface/60 backdrop-blur-sm flex items-center justify-center p-space-md">
            <div className="bg-surface-container-lowest rounded-xl shadow-xl max-w-xl w-full p-space-lg flex flex-col space-y-space-md border border-outline-variant/30">
              {/* Modal Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[24px]">broadcast_on_home</span>
                  </div>
                  <div>
                    <div className="font-headline-md text-headline-md text-on-surface">
                      Live Dispatch Broadcast Executing
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      Phagwara Mandi Multi-Channel Audio & PUSH Trigger
                    </div>
                  </div>
                </div>
                <button className="text-outline hover:text-on-surface" onClick={() => setModalOpen(false)}>
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Live Broadcast Body */}
              <div className="bg-surface-container-low p-space-md rounded-lg space-y-space-sm">
                <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                  <span className="font-label-sm text-label-sm uppercase text-outline">Token Allocated</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-secondary">A-104</span>
                </div>
                <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                  <span className="font-label-sm text-label-sm uppercase text-outline">Farmer</span>
                  <span className="font-label-lg text-label-lg font-bold text-on-surface">
                    Balwinder Kaur (KRN-PB-88219)
                  </span>
                </div>
                <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                  <span className="font-label-sm text-label-sm uppercase text-outline">Allocated Destination</span>
                  <span className="font-data-mono text-data-mono font-bold text-primary">
                    COUNTER 07 — Weighbridge Bay 3
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm uppercase text-outline">
                    Generated SMS & Mandi Speaker Announcement
                  </span>
                  <div className="mt-1 bg-surface-container-lowest p-space-sm rounded font-data-mono text-data-mono text-on-surface text-xs leading-relaxed">
                    "ਧਿਆਨ ਦਿਓ: ਕਿਸਾਨ ਬਲਵਿੰਦਰ ਕੌਰ (ਟੋਕਨ A-104), ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੀ ਕਣਕ (120 ਕੁਇੰਟਲ) ਲੈ ਕੇ ਕਾਊਂਟਰ 7 'ਤੇ ਪਹੁੰਚੋ।
                    <br />
                    Attention: Farmer Balwinder Kaur, proceed to Counter 7 with Weighment Gate Slip."
                  </div>
                </div>
              </div>

              {/* Simulated Transmission Status */}
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-outline flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-surface-tint"></span>Farmer Mobile App Push
                  </span>
                  <span className="text-surface-tint font-bold">Delivered (48ms)</span>
                </div>
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-outline flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-surface-tint"></span>SMS Gateway (+91 98721-XXXXX)
                  </span>
                  <span className="text-surface-tint font-bold">Sent via NIC-SMS</span>
                </div>
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-outline flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>Yard PA Speaker
                    PA-04
                  </span>
                  <span className="text-secondary font-bold">Announcing in Punjabi/Hindi</span>
                </div>
              </div>

              {/* Action Confirmation Buttons */}
              <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                <button
                  className="px-space-md py-space-xs bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded font-label-md text-label-md"
                  onClick={() => setModalOpen(false)}
                >
                  Dismiss
                </button>
                <button
                  className="px-space-md py-space-xs bg-primary hover:bg-primary-container text-on-primary rounded font-label-md text-label-md font-bold flex items-center gap-1 shadow-sm"
                  onClick={confirmDispatch}
                >
                  <span className="material-symbols-outlined text-[16px]">done_all</span>Confirm Gate Dispatch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST FEEDBACK NOTIFICATION */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-space-md py-space-sm rounded-lg shadow-lg flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[20px]">notifications_active</span>
            <div className="font-label-md text-label-md font-bold">{toast}</div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
