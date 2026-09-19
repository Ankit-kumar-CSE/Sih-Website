import { useEffect, useState } from 'react'
import AppShell from '../components/AppShell'
import { useAdminAuth } from '../store/adminAuth'
import { adminFetch } from '../hooks/useApi'

const FARMER_PHOTO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDcT2PUmVHTVptWtSeIm8q0FiBn67VbiK1r73vCgLwoOJyPF9nC-ZnXz6haPSXHd7jq1enZf1NL8NNe8EOhU9rxNygkeQkDOR38Vc5c5DpU8wJ31T9GxP38d2JsOhj2XL5xPvDJe5hbTbmCM5muRjC6J3dC860_7tRsvFrryQgL5AvLM6LPUFQ0UhOw6oyqP30sampQ5oRS7qnDIHf2WQLP78DmwLhq6DAdWtcbS1_aMFXPBxC8WAWq'

const GRAIN_PHOTO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCfQE8zBsca1fVtG8gpxl0HyvSx4WEokEBmmOHGdeUlXKcv1D_WkVe-BiKcalL1JY73akDqg41oULXJjzeWYRSzmOyBEnpEM1YrEnHpTmayspjtYrldvJXG9uK0ByISch14NtL_1_G6-5fGPSenvWQVTMOb2NvZ6lCtlPkhKPhw2vf9TaCslRO66vg5x3xBt0JcCzDmdJwKgdxvEq1FlGu77P8bF9L9bJ5y2CN-30sAQB0rasqHf0QT'

const ASSAY_CARDS = [
  {
    label: 'Moisture Content',
    badge: 'PASS',
    value: '11.4',
    bar: '71.25%',
    limit: 'Tolerance: ≤ 12.0%',
    note: '-0.60% Margin',
  },
  {
    label: 'Foreign Matter',
    badge: 'GRADE A',
    value: '0.40',
    bar: '53.3%',
    limit: 'Permissible: < 0.75%',
    note: 'Optimal Clean',
  },
  {
    label: 'Damaged / Shriveled',
    badge: 'PASS',
    value: '1.20',
    bar: '60%',
    limit: 'Permissible: < 2.0%',
    note: 'Sound Kernel',
  },
]

const STEPS = [
  {
    n: 1,
    title: '1. Gate Check-in',
    meta: 'PB-09-M-4821 • 10:14',
    state: 'done',
    connector: 'bg-primary-container/40',
  },
  {
    n: 2,
    title: '2. Counter Queue',
    meta: 'Counter 02 • 10:28',
    state: 'done',
    connector: 'bg-primary-container/40',
  },
  {
    n: 3,
    title: '3. Assay Testing',
    meta: 'GAC-2500 • 10:32',
    state: 'done',
    connector: 'bg-primary-container/40',
  },
  {
    n: 4,
    title: '4. Weighbridge Bay',
    meta: '85.00 Q Net • 10:34',
    state: 'done',
    connector: 'bg-secondary',
  },
  { n: 5, title: '5. MSP Validation', meta: 'Awaiting Sign-off', state: 'active' },
  { n: 6, title: '6. Instant DBT', meta: 'PFMS Cleared', state: 'queued' },
]

export default function ProcurementWorkspace() {
  const { token, apiBase, admin } = useAdminAuth()
  const centreId = admin?.centreId || 'KR-PHK-01'

  const [approving, setApproving] = useState(false)
  const [certModalOpen, setCertModalOpen] = useState(false)
  const [activeBooking, setActiveBooking] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const data = await adminFetch(apiBase, token, `/api/operator/queue?centreId=${centreId}`)
        // Find the booking currently being processed (status: processing or in-queue)
        const processing = (data?.queue || []).find((b) =>
          b.status === 'processing' || b.status === 'in-queue'
        )
        if (!cancelled) setActiveBooking(processing || null)
      } catch {
        // No active booking fetched — show static demo data
      }
    }
    load()
    const interval = setInterval(load, 15000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [apiBase, token, centreId])

  const executeProcurementApproval = async () => {
    setApproving(true)
    try {
      if (activeBooking) {
        await adminFetch(apiBase, token, '/api/operator/advance', {
          method: 'POST',
          body: { bookingId: activeBooking.booking_id || activeBooking.bookingId },
        })
      }
      setTimeout(() => {
        setApproving(false)
        setCertModalOpen(true)
      }, 600)
    } catch {
      setApproving(false)
    }
  }

  const nextFarmerToken = () => {
    setCertModalOpen(false)
    window.alert('Calling next token to the counter.')
  }

  const requestSecondaryReview = () => {
    const reason = window.prompt('Specify reason for Secondary Assay Verification:', 'Moisture sensor marginal variation re-test')
    if (reason) {
      window.alert('Token A-103 referred to Chief Nodal Assayer for secondary validation. Reason logged.')
    }
  }

  const rejectProduceDialog = () => {
    const reason = window.prompt('Specify rejection statutory code (e.g. Moisture >12%, Foreign Matter >0.75%, Infestation):')
    if (reason) {
      window.alert('REJECTION NOTICE INITIATED: Lot A-103 rejected. Mandatory photographic evidence flagged. Farmer notified via SMS.')
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col w-full space-y-space-md">
        {/* Operational Alert & Context Topstrip */}
        <div className="w-full bg-primary text-on-primary px-space-md py-space-sm rounded flex flex-wrap items-center justify-between gap-space-sm shadow-sm">
          <div className="flex items-center gap-space-sm min-w-0">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold">
              02
            </span>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs flex-wrap">
                <span className="font-headline-sm text-headline-sm text-on-primary tracking-tight">
                  Counter 02: High-Precision Quality & Weighment Desk
                </span>
                <span className="bg-primary-container text-on-primary-container px-space-xs py-[1px] rounded font-label-sm text-label-sm uppercase tracking-wider">
                  Mandi ID: PB-KAP-102 (Phagwara)
                </span>
              </div>
              <div className="font-body-sm text-body-sm text-primary-fixed-dim truncate">
                Active Operator:{' '}
                <strong className="text-on-primary">Gurpreet Singh (Badge #OP-882)</strong> • Sensor Node:
                Avery-WB-02 Connected • Calibrated 07:00 AM IST
              </div>
            </div>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-space-xs bg-primary-container px-space-md py-space-xs rounded">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-ping"></span>
              <span className="font-label-md text-label-md text-on-primary">TOKEN IN BAY:</span>
              <span className="font-headline-md text-headline-md text-secondary-fixed font-bold tracking-wider">
                A-103
              </span>
            </div>
            <div className="text-right hidden sm:block">
              <div className="font-label-sm text-label-sm text-primary-fixed-dim uppercase">Twell Duration</div>
              <div className="font-data-mono text-data-mono text-on-primary font-bold">04m : 12s</div>
            </div>
          </div>
        </div>

        {/* Progress Stepper: End-to-End Mandi Workflow */}
        <div className="w-full bg-surface-container-lowest p-space-md rounded shadow-sm">
          <div className="flex items-center justify-between gap-space-xs overflow-x-auto pb-space-xs">
            {STEPS.map((step) => {
              if (step.state === 'done') {
                return (
                  <div key={step.n} className="flex items-center gap-space-xs flex-1 min-w-[130px]">
                    <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-label-sm text-label-sm font-bold">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-label-md text-label-md text-primary font-bold truncate">{step.title}</div>
                      <div className="font-data-mono text-data-mono text-on-surface-variant truncate">{step.meta}</div>
                    </div>
                    {step.connector && (
                      <span className={`h-[2px] flex-1 ${step.connector} hidden md:block`}></span>
                    )}
                  </div>
                )
              }
              if (step.state === 'active') {
                return (
                  <div
                    key={step.n}
                    className="flex items-center gap-space-xs flex-1 min-w-[140px] bg-secondary-fixed/50 px-space-xs py-1 rounded"
                  >
                    <div className="w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-label-sm text-label-sm font-bold animate-pulse">
                      5
                    </div>
                    <div className="min-w-0">
                      <div className="font-label-md text-label-md text-secondary font-bold truncate">{step.title}</div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant truncate">{step.meta}</div>
                    </div>
                    <span className="h-[2px] flex-1 bg-surface-container-highest hidden md:block"></span>
                  </div>
                )
              }
              return (
                <div key={step.n} className="flex items-center gap-space-xs flex-1 min-w-[120px] opacity-60">
                  <div className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center font-label-sm text-label-sm">
                    6
                  </div>
                  <div className="min-w-0">
                    <div className="font-label-md text-label-md text-on-surface truncate">{step.title}</div>
                    <div className="font-label-sm text-label-sm text-outline truncate">{step.meta}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Primary Working Grid (3-Column Asymmetric Operational Workspace) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md w-full">
          {/* Column 1: Farmer Dossier, Biometric & Produce Authenticity (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-space-md">
            {/* Farmer Identity Dossier */}
            <div className="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col space-y-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary-container text-[18px]">badge</span>
                  <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-bold">
                    Verified Farmer Profile
                  </span>
                </div>
                <span className="inline-flex items-center gap-space-xs bg-primary-container/15 text-primary-container px-space-xs py-[1px] rounded font-label-sm text-label-sm font-bold">
                  <span className="material-symbols-outlined text-[12px]">verified</span> AADHAAR PASS
                </span>
              </div>
              <div className="flex items-start gap-space-md pt-space-xs">
                <img
                  alt="Portrait of Harinder Singh, a middle-aged Punjabi Sikh farmer with a warm weathered expression, donning an ochre-orange turban and light cream cotton kurta, set against a soft daylight agricultural backdrop in realistic civic documentary style."
                  className="w-16 h-16 rounded object-cover flex-shrink-0 bg-surface-container"
                  src={FARMER_PHOTO}
                />
                <div className="flex flex-col min-w-0">
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold truncate">
                    Harinder Singh
                  </h2>
                  <div className="font-data-mono text-data-mono text-primary font-bold">KRN-PB-66321</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[14px]">call</span> +91 98140-XXXXX
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded space-y-space-xs text-body-sm font-body-sm">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Village & District:</span>
                  <span className="font-label-md text-label-md text-on-surface font-bold">Ranipur, Kapurthala</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Land Title Portal (PLRS):</span>
                  <span className="font-data-mono text-data-mono text-primary-container font-bold flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span> Khasra #142/8 (4.5 Ha)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">MSP Slot Booking ID:</span>
                  <span className="font-data-mono text-data-mono text-on-surface">BK-2025-04-8891</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant">Assigned Crop Area:</span>
                  <span className="font-label-md text-label-md text-on-surface">Rabi Wheat 2024-25</span>
                </div>
              </div>
              {/* Vehicle Gate Logistics Pass */}
              <div className="bg-surface-container p-space-sm rounded flex flex-col space-y-space-xs">
                <div className="flex items-center justify-between text-label-sm font-label-sm">
                  <span className="text-outline uppercase font-bold tracking-wider">Gate Clearance Pass</span>
                  <span className="text-primary-container font-bold">ANPR Camera Validated</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[18px]">agriculture</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">PB-09-M-4821</span>
                  </div>
                  <span className="bg-surface-container-lowest px-space-xs py-[2px] rounded font-data-mono text-data-mono text-on-surface-variant">
                    Tractor Trolley
                  </span>
                </div>
                <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant">
                  <span>Gate Inbound Time:</span>
                  <span className="font-data-mono text-data-mono text-on-surface">10:14:22 AM IST</span>
                </div>
              </div>
              {/* Direct DBT Beneficiary Details */}
              <div className="bg-surface-container-low p-space-sm rounded flex flex-col space-y-space-xs">
                <div className="flex items-center justify-between font-label-sm text-label-sm">
                  <span className="text-outline uppercase font-bold">PFMS Escrow Direct Deposit</span>
                  <span className="bg-primary-container text-on-primary px-space-xs py-[0.5px] rounded font-label-sm text-label-sm">
                    DBT LINKED
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface">Punjab National Bank</span>
                  <span className="font-data-mono text-data-mono text-primary font-bold">A/C *******4910</span>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant">
                  IFSC: PUNB0024100 • NPCI Aadhar Bridge Status: ACTIVE
                </div>
              </div>
            </div>

            {/* Lot Specimen & Visual Assaying Snapshot */}
            <div className="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col space-y-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-bold">
                  Station Camera Feed
                </span>
                <span className="flex items-center gap-space-xs font-label-sm text-label-sm text-primary-container">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span> LOT OPTICAL SCAN
                </span>
              </div>
              <div className="relative w-full h-36 rounded overflow-hidden bg-surface-container">
                <img
                  alt="High-resolution laboratory macro photo of golden Sharbati wheat grains spread evenly across a matte stainless steel agricultural assaying pan under clinical LED inspection lighting, showing pristine grain structure with negligible chaff or impurities."
                  className="w-full h-full object-cover"
                  src={GRAIN_PHOTO}
                />
                <div className="absolute bottom-1 left-1 right-1 bg-surface-container-lowest/90 px-space-xs py-[2px] rounded flex items-center justify-between font-data-mono text-data-mono text-on-surface">
                  <span>GAC-Cam-02 Optical Telemetry</span>
                  <span className="text-primary font-bold">GRAIN INTEGRITY: 98.4%</span>
                </div>
              </div>
              <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant pt-space-xs">
                <span>Declared Qty (e-Pass):</span>
                <span className="font-data-mono text-data-mono text-on-surface font-bold">85.00 Q (8,500 kg)</span>
              </div>
              <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span>Commodity Variety:</span>
                <span className="font-label-md text-label-md text-primary font-bold">Sharbati Wheat (Grade A)</span>
              </div>
            </div>
          </div>

          {/* Column 2 & 3: High Precision Assaying & Weighbridge Bridge (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-space-md">
            {/* Real-Time Quality Analyzer Feed (DICKEY-john GAC-2500 AGRI) */}
            <div className="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col space-y-space-md">
              <div className="flex flex-wrap items-center justify-between gap-space-sm">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary-container text-[20px]">science</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Automated Assaying & Grain Quality Analyzer
                    </h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Device: DICKEY-john GAC-2500-AGRI NIR Assay Station • Sensor #DJ-9931
                  </p>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="bg-primary-container/10 text-primary-container px-space-sm py-space-xs rounded font-label-md text-label-md font-bold">
                    ✓ GOVT GRADE A SPECIFICATION
                  </span>
                </div>
              </div>

              {/* 3-Metrics Assay Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                {ASSAY_CARDS.map((card) => (
                  <div
                    key={card.label}
                    className="bg-surface-container-low p-space-sm rounded flex flex-col justify-between space-y-space-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm uppercase font-bold text-outline">{card.label}</span>
                      <span className="bg-primary-container text-on-primary px-space-xs py-[0.5px] rounded font-label-sm text-label-sm font-bold">
                        {card.badge}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-space-xs">
                      <span className="font-headline-xl text-headline-xl text-primary font-bold">{card.value}</span>
                      <span className="font-label-md text-label-md text-on-surface-variant">%</span>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary-container h-full rounded-full" style={{ width: card.bar }}></div>
                      </div>
                      <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                        <span>{card.limit}</span>
                        <span className="text-primary font-bold">{card.note}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Assay Statutory Declaration Strip */}
              <div className="bg-surface-container-high p-space-sm rounded flex flex-wrap items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                  <span>Food Corporation of India (FCI) Kharif-Rabi Quality Protocol MSP-102 Verified</span>
                </div>
                <div className="flex items-center gap-space-sm font-data-mono text-data-mono text-outline">
                  <span>Test Cert: #QC-88192</span>
                  <span>•</span>
                  <span>Stamp: 10:32:08 IST</span>
                </div>
              </div>
            </div>

            {/* Electronic Weighbridge Telemetry Desk (Live Hardware Ingestion) */}
            <div className="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col space-y-space-md">
              <div className="flex flex-wrap items-center justify-between gap-space-sm">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[20px]">scale</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                      Electronic Weighbridge Sensor Bay 02
                    </h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Avery Weigh-Tronix Bridge Hub • Loadcell Status: Zero Calibrated • Model ZM510
                  </p>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="bg-surface-container-high text-on-surface-variant px-space-xs py-[2px] rounded font-data-mono text-data-mono">
                    STAMP #WB-20250415-09412
                  </span>
                </div>
              </div>

              {/* Telemetry Breakdown Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                <div className="bg-surface-container-low p-space-sm rounded flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-outline">
                    1. Gross Laden Weight
                  </span>
                  <div className="flex items-baseline gap-space-xs my-1">
                    <span className="font-headline-lg text-headline-lg text-on-surface font-bold">14,280.00</span>
                    <span className="font-label-md text-label-md text-on-surface-variant">kg</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Vehicle + Driver + Trolley + Produce
                  </span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase font-bold text-outline">
                    2. Tare Unladen Weight
                  </span>
                  <div className="flex items-baseline gap-space-xs my-1">
                    <span className="font-headline-lg text-headline-lg text-on-surface font-bold">5,780.00</span>
                    <span className="font-label-md text-label-md text-on-surface-variant">kg</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Verified Standard Tare Reference
                  </span>
                </div>
                {/* Highlighted Net Yield */}
                <div className="bg-primary text-on-primary p-space-sm rounded flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <span className="font-label-sm text-label-sm uppercase font-bold text-primary-fixed">
                      3. Net Certified Produce
                    </span>
                    <span className="bg-secondary text-on-secondary px-space-xs py-[0.5px] rounded font-label-sm text-label-sm font-bold">
                      MATCH 100%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-space-xs my-1">
                    <span className="font-headline-xl text-headline-xl text-on-primary font-bold">8,500.00</span>
                    <span className="font-label-md text-label-md text-primary-fixed-dim">kg</span>
                  </div>
                  <div className="flex items-center justify-between font-label-md text-label-md text-primary-fixed">
                    <span>
                      Equiv: <strong>85.00 Quintals</strong>
                    </span>
                    <span className="font-data-mono text-data-mono text-secondary-fixed font-bold">Δ 0.00%</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low px-space-md py-space-xs rounded flex flex-wrap items-center justify-between gap-space-xs font-body-sm text-body-sm">
                <div className="flex items-center gap-space-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[16px]">lock</span>
                  <span>
                    Digital Weights & Measures Tamper Proof Ledger Record (W&M Act 2009 Compliant)
                  </span>
                </div>
                <span className="font-data-mono text-data-mono text-primary font-bold">SHA-256 Hash: 9f8a...c041</span>
              </div>
            </div>

            {/* Financial Settlement Engine & Statutory MSP Matrix */}
            <div className="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col space-y-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary-container text-[20px]">calculate</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Statutory MSP Rate Engine & Automated Settlement
                  </h3>
                </div>
                <span className="bg-secondary/15 text-secondary px-space-sm py-[2px] rounded font-label-sm text-label-sm font-bold">
                  DIRECT FARMER PAYMENT (ZERO COMMISSION)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                {/* Computation Ledger */}
                <div className="space-y-space-xs text-body-md font-body-md">
                  <div className="flex justify-between py-1 border-b border-surface-container">
                    <span className="text-on-surface-variant">Official Central MSP (Wheat 2024-25):</span>
                    <span className="font-data-mono text-data-mono font-bold text-on-surface">₹2,275.00 / Q</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-container">
                    <span className="text-on-surface-variant">Net Net Certified Weight:</span>
                    <span className="font-data-mono text-data-mono font-bold text-on-surface">85.00 Q (8500 kg)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-container">
                    <span className="text-on-surface-variant">Base Commodity Value:</span>
                    <span className="font-data-mono text-data-mono font-bold text-on-surface">₹1,93,375.00</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-surface-container">
                    <span className="text-on-surface-variant">Grade A Moisture Premium Incentive:</span>
                    <span className="font-data-mono text-data-mono text-primary font-bold">+ ₹0.00 (Standard)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-on-surface-variant">Mandi Development Cess & Bagging:</span>
                    <span className="font-label-sm text-label-sm text-primary-container font-bold">
                      100% GOVT SUBSIDIZED
                    </span>
                  </div>
                </div>
                {/* Total Farmer Payable Banner Card */}
                <div className="bg-surface-container-high p-space-md rounded flex flex-col justify-between">
                  <div>
                    <span className="font-label-sm text-label-sm uppercase font-bold text-outline">
                      Direct Benefit Transfer Amount
                    </span>
                    <div className="font-headline-xl text-headline-xl text-primary font-bold my-1">
                      ₹1,93,375<span className="text-headline-md">.00</span>
                    </div>
                    <p className="font-label-md text-label-md text-on-surface-variant italic">
                      Rupees One Lakh Ninety-Three Thousand Three Hundred Seventy-Five Only
                    </p>
                  </div>
                  <div className="mt-space-sm pt-space-xs flex items-center justify-between font-label-sm text-label-sm text-on-surface border-t border-surface-container-highest">
                    <span>PFMS Settlement Queue:</span>
                    <span className="font-data-mono text-data-mono text-primary font-bold">
                      DIRECT DISBURSEMENT T+0
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Command Authority Execution Actions */}
            <div className="bg-surface-container-lowest p-space-md rounded shadow-sm flex flex-col space-y-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                  Statutory Officer Authorizations
                </span>
                <span className="font-label-sm text-label-sm text-outline-variant">Digital Token: A-103</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-space-sm">
                {/* APPROVE CTA (Giant Emerald Authority) */}
                <button
                  className={`sm:col-span-7 bg-primary-container hover:bg-primary text-on-primary py-space-md px-space-lg rounded flex items-center justify-center gap-space-sm transition-all shadow-md active:scale-[0.99] ${approving ? 'opacity-75 cursor-wait' : ''}`}
                  onClick={executeProcurementApproval}
                  disabled={approving}
                >
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                  <div className="text-left">
                    <div className="font-headline-sm text-headline-sm leading-tight uppercase tracking-wider">
                      Approve & Issue Procurement Certificate
                    </div>
                    <div className="font-label-sm text-label-sm text-primary-fixed-dim">
                      Finalize 85.00 Q Intake • Push Silo Inventory • Trigger DBT
                    </div>
                  </div>
                </button>
                {/* Secondary Review */}
                <button
                  className="sm:col-span-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface py-space-md px-space-sm rounded flex items-center justify-center gap-space-xs transition-colors font-label-md text-label-md font-bold"
                  onClick={requestSecondaryReview}
                >
                  <span className="material-symbols-outlined text-secondary text-[18px]">rate_review</span>
                  <span>Secondary Review</span>
                </button>
                {/* Reject Action */}
                <button
                  className="sm:col-span-2 bg-error text-on-error hover:bg-on-error-container py-space-md px-space-sm rounded flex items-center justify-center gap-space-xs transition-colors font-label-md text-label-md font-bold"
                  onClick={rejectProduceDialog}
                >
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                  <span>Reject Lot</span>
                </button>
              </div>
              <div className="flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant pt-space-xs">
                <span className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[14px] text-primary">sms</span>
                  Automated SMS with weighment slip & DBT transaction reference will dispatch to Harinder Singh
                  (+91 98140-XXXXX).
                </span>
                <span className="font-data-mono text-data-mono text-outline">IP: 10.24.110.42 (NIC LAN)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Modal Overlay for Instant Digital Certificate Issue (Simulation UI) */}
        {certModalOpen && (
          <div className="fixed inset-0 z-50 bg-inverse-surface/60 flex items-center justify-center p-space-md backdrop-blur-sm">
            <div className="bg-surface-container-lowest rounded p-space-lg max-w-xl w-full shadow-xl flex flex-col space-y-space-md">
              <div className="flex items-center justify-between bg-primary-container text-on-primary p-space-sm rounded">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[22px]">check_circle</span>
                  <h4 className="font-headline-sm text-headline-sm uppercase">
                    Procurement Completed & DBT Dispatched
                  </h4>
                </div>
                <button className="text-on-primary hover:opacity-80" onClick={() => setCertModalOpen(false)}>
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <div className="p-space-sm bg-surface-container-low rounded space-y-space-xs text-body-sm font-body-sm">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Receipt No:</span>
                  <span className="font-data-mono text-data-mono font-bold text-on-surface">KRN-MSP-2025-098231</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Beneficiary:</span>
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Harinder Singh (KRN-PB-66321)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Disbursed Sum:</span>
                  <span className="font-data-mono text-data-mono text-primary font-bold text-body-lg">
                    ₹1,93,375.00
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Silo Stock Allocation:</span>
                  <span className="font-label-md text-label-md text-on-surface">
                    Phagwara Silo Bay 04 (+85.00 Q)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">PFMS Reference:</span>
                  <span className="font-data-mono text-data-mono text-outline">C042509128312-DBT</span>
                </div>
              </div>
              <div className="flex items-center gap-space-xs text-label-sm font-label-sm text-primary">
                <span className="material-symbols-outlined text-[16px]">print</span>
                Weighbridge Slip & Statutory MSP Certificate printed on Counter 02 Thermal Terminal.
              </div>
              <div className="flex justify-end gap-space-sm">
                <button
                  className="bg-surface-container-high px-space-md py-space-xs rounded font-label-md text-label-md text-on-surface"
                  onClick={() => setCertModalOpen(false)}
                >
                  Close
                </button>
                <button
                  className="bg-primary-container text-on-primary px-space-lg py-space-xs rounded font-label-md text-label-md font-bold"
                  onClick={nextFarmerToken}
                >
                  Proceed to Token A-104 →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}