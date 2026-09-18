import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EMBLEM_SRC } from '../components/AppShell'

const ROLE_CARDS = [
  {
    icon: 'fa-solid fa-globe',
    tile: 'bg-brand-900 text-amber-400',
    title: 'National Admin',
    meta: '2,480 Centres • Apex Control',
  },
  {
    icon: 'fa-solid fa-map',
    tile: 'bg-blue-800 text-blue-100',
    title: 'Regional Admin',
    meta: 'Zone Lockdown (e.g. Doaba)',
  },
  {
    icon: 'fa-solid fa-building-wheat',
    tile: 'bg-emerald-800 text-emerald-100',
    title: 'Centre Manager',
    meta: 'Single Mandi Capacity & Slots',
  },
  {
    icon: 'fa-solid fa-scale-balanced',
    tile: 'bg-amber-700 text-amber-100',
    title: 'Centre Operator',
    meta: 'Counter Queue & Weighment',
  },
]

const AUTH_TABS = [
  { icon: 'fa-solid fa-id-card', label: 'Officer ID / Email' },
  { icon: 'fa-solid fa-fingerprint', label: 'Jan Parichay (SSO)' },
  { icon: 'fa-solid fa-key', label: 'Hardware Token (FIPS)' },
]

export default function Login() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [trustedDevice, setTrustedDevice] = useState(true)
  const [authenticating, setAuthenticating] = useState(false)

  const handleAuthenticate = () => {
    setAuthenticating(true)
    setTimeout(() => navigate('/national-command'), 700)
  }

  return (
    <div className="bg-slate-100 text-slate-900 min-h-screen flex flex-col justify-between antialiased selection:bg-brand-100 selection:text-brand-900">
      {/* Top Sovereign Header Bar */}
      <div>
        <div className="tricolor-stripe w-full"></div>
        <header className="bg-brand-950 border-b border-brand-800/80 px-6 py-2.5 text-white flex flex-wrap items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <img
              src={EMBLEM_SRC}
              alt="KisanRaw Emblem"
              className="w-9 h-9 rounded shadow-md border border-amber-500/30 object-contain bg-brand-900"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-wider text-base uppercase text-white font-sans">
                  KisanRaw Centre Operations
                </span>
                <span className="bg-amber-500 text-brand-950 font-bold text-[10px] px-2 py-0.5 rounded tracking-wide">
                  GOV.IN PORTAL
                </span>
                <span className="text-xs bg-brand-900 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                  NIC-GovNet SSLv3
                </span>
              </div>
              <p className="text-[11px] text-slate-300 tracking-normal">
                National Agriculture Procurement Command & Control Grid • Ministry of Agriculture & Farmers Welfare
              </p>
            </div>
          </div>

          {/* Quick Portal Meta & Language switcher */}
          <div className="flex items-center space-x-5 text-xs">
            <div className="hidden md:flex items-center space-x-3 bg-brand-900/90 px-3 py-1.5 rounded border border-brand-700/60 font-mono text-[11px] text-slate-200">
              <span className="flex items-center text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
                CERT-In COMPLIANT
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">ISO 27001 / FIPS 140-2</span>
            </div>

            <div className="flex items-center bg-brand-900 border border-brand-700 rounded overflow-hidden text-xs">
              <button className="px-2.5 py-1 font-semibold text-white bg-brand-700">English</button>
              <button className="px-2.5 py-1 text-slate-300 hover:text-white transition">हिन्दी</button>
              <button className="px-2.5 py-1 text-slate-300 hover:text-white transition">ਪੰਜਾਬੀ</button>
            </div>

            <div className="flex items-center text-slate-300 hover:text-white cursor-pointer transition space-x-1.5 text-xs">
              <i className="fa-solid fa-headset text-amber-400"></i>
              <span>NIC Desk 1800-11-8899</span>
            </div>
          </div>
        </header>
      </div>

      {/* Main Content Gateway Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Context, Hierarchy & Real-Time Operational Banner */}
        <div className="lg:col-span-6 space-y-6">
          {/* High Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-100/90 border border-emerald-300 px-3 py-1 rounded-full text-brand-900 font-semibold text-xs tracking-wide shadow-sm">
            <i className="fa-solid fa-shield-halved text-brand-700"></i>
            <span>RESTRICTED ACCESS • AUTHORIZED OFFICIALS ONLY</span>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Unified Apex Operations & <br />
              <span className="text-brand-800">Direct Procurement Access Gateway</span>
            </h1>
            <p className="mt-3 text-slate-600 text-sm leading-relaxed max-w-xl">
              Sign in to access real-time counter queues, electronic weighbridges, AI harvest redistribution, and
              statutory MSP disbursements under the National Agriculture Digital Grid.
            </p>
          </div>

          {/* Autonomous Role Detection Explanation Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <i className="fa-solid fa-microchip text-brand-700"></i>
                <span>Autonomous Role & Mandi Resolution</span>
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
                Zero Manual Role Picker
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              The portal cryptographically checks your credentials, designated jurisdiction, and hardware token to
              auto-bind your operational scope upon authentication:
            </p>

            {/* Role Resolution Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              {ROLE_CARDS.map((role) => (
                <div
                  key={role.title}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start space-x-2.5"
                >
                  <div
                    className={`w-7 h-7 rounded bg-brand-900 flex items-center justify-center font-bold text-xs shrink-0 ${role.tile}`}
                  >
                    <i className={role.icon}></i>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{role.title}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{role.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Live Security Heartbeat */}
          <div className="bg-brand-900 text-white rounded-xl p-4 shadow-sm border border-brand-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center">
                <span className="w-3 h-3 bg-emerald-400 rounded-full animate-ping absolute"></span>
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full relative"></span>
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-300 font-mono uppercase tracking-wide">
                  Secure Grid Session Active
                </div>
                <div className="text-[11px] text-slate-300 font-mono">
                  Terminal IP: 10.24.110.42 (NIC Dedicated Subnet) • Latency: 19ms
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] bg-brand-950 text-amber-300 px-2 py-1 rounded border border-brand-700 font-mono">
                SHA-512 TLS
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Login & 2FA Gateway Form */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
            {/* Gateway Card Header */}
            <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 px-7 py-5 text-white border-b border-brand-700 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-amber-300 font-semibold tracking-wider uppercase">
                  Authentication Protocol v4.2
                </span>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
                  <span>Secure Official Sign-In</span>
                  <i className="fa-solid fa-lock text-amber-400 text-sm"></i>
                </h2>
              </div>
              <div className="text-right">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-mono font-bold px-2 py-1 rounded">
                  2FA MANDATORY
                </span>
              </div>
            </div>

            {/* Tab Selector: Parichay / Aadhaar / Gov Credential */}
            <div className="flex border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
              {AUTH_TABS.map((tab, idx) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(idx)}
                  className={`flex-1 py-3 px-4 flex items-center justify-center space-x-2 transition ${
                    activeTab === idx
                      ? 'border-b-2 border-brand-700 text-brand-900 bg-white'
                      : 'hover:text-slate-900'
                  }`}
                >
                  <i className={`${tab.icon} ${activeTab === idx ? 'text-brand-700' : 'text-slate-400'}`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Form Body */}
            <div className="p-6 md:p-8 space-y-5">
              {/* Step 1: Officer Identification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Government Officer ID / Registered Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <i className="fa-regular fa-envelope"></i>
                  </span>
                  <input
                    type="text"
                    defaultValue="swaminathan.rk@nic.gov.in"
                    className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 transition"
                    placeholder="e.g. officer.id@gov.in"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold flex items-center space-x-1">
                      <i className="fa-solid fa-circle-check text-[10px]"></i>
                      <span>ID VERIFIED</span>
                    </span>
                  </div>
                </div>
                {/* Auto Detected Identity Banner */}
                <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="text-slate-700">
                      Account Bound: <strong className="text-slate-900 font-semibold">Dr. R. K. Swaminathan</strong>
                    </span>
                  </div>
                  <span className="bg-brand-900 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                    Role Detected: National Admin
                  </span>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Platform Security Password
                  </label>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-brand-700 font-semibold hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <i className="fa-solid fa-key"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    defaultValue="••••••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 transition"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  >
                    <i className={`text-sm ${showPassword ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash'}`}></i>
                  </button>
                </div>
              </div>

              {/* 2FA & Multi-Factor Section */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <i className="fa-solid fa-shield-halved text-amber-600"></i>
                    <span>Two-Factor Authentication (Aadhaar / TOTP)</span>
                  </label>
                  <span className="text-[11px] text-brand-700 font-medium hover:underline cursor-pointer">
                    Resend via SMS (42s)
                  </span>
                </div>

                {/* OTP Digit Input Boxes */}
                <div className="flex items-center justify-between gap-2">
                  {['7', '4', '9', '2', '6', '8'].map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      defaultValue={digit}
                      className="w-12 h-12 text-center text-lg font-bold font-mono bg-slate-50 border-2 border-brand-700 text-brand-900 rounded-lg focus:outline-none ring-2 ring-brand-700/20"
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 flex items-center space-x-1.5">
                  <i className="fa-solid fa-mobile-screen-button text-slate-400"></i>
                  <span>
                    One-Time Code dispatched to Aadhaar-linked mobile:{' '}
                    <strong>+91 98XXX-XX882</strong>
                  </span>
                </p>
              </div>

              {/* Trust Device & Session Settings */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={trustedDevice}
                    onChange={(e) => setTrustedDevice(e.target.checked)}
                    className="w-4 h-4 text-brand-700 border-slate-300 rounded focus:ring-brand-700"
                  />
                  <span>Register terminal as Trusted Workstation (12h session)</span>
                </label>
                <span className="text-slate-400 text-[11px] font-mono">Token: A-SEC-7709</span>
              </div>

              {/* Primary Submit Action */}
              <div className="pt-2">
                <button
                  onClick={handleAuthenticate}
                  disabled={authenticating}
                  className="w-full bg-brand-900 hover:bg-brand-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-brand-900/25 flex items-center justify-center space-x-2.5 transition duration-150 transform active:scale-[0.99] disabled:opacity-80 disabled:cursor-wait"
                >
                  <i className={`text-amber-400 ${authenticating ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-lock-open'}`}></i>
                  <span className="tracking-wide text-sm font-semibold uppercase">
                    {authenticating
                      ? 'Authenticating — Binding Operational Scope…'
                      : 'Authenticate & Launch Assigned Command Workspace'}
                  </span>
                  {!authenticating && <i className="fa-solid fa-arrow-right text-xs text-amber-400"></i>}
                </button>
              </div>

              {/* Automated Redirection Notice */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center text-xs text-slate-600 flex items-center justify-center space-x-2">
                <i className="fa-solid fa-arrows-split-up-and-left text-brand-700"></i>
                <span>
                  System will autonomously route to:{' '}
                  <strong className="text-slate-900 font-semibold">National Command Dashboard (/national-apex)</strong>
                </span>
              </div>
            </div>

            {/* Card Security Footer */}
            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-triangle-exclamation text-amber-600"></i>
                <span>Legal Warning: Unauthorized access attracts penal action under Section 43 & 66 of IT Act 2000.</span>
              </div>
              <span className="font-mono text-slate-400 font-semibold">REF: KR-AUTH-2025</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Sovereign Footer */}
      <footer className="bg-white border-t border-slate-200 mt-6 py-4 px-6 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-slate-800 tracking-wide">KisanRaw Digital Infrastructure</span>
            <span className="text-slate-300">|</span>
            <span>Designed & Hosted by National Informatics Centre (NIC)</span>
            <span className="text-slate-300">|</span>
            <span>Govt. of India</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-500 text-[11px]">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-900 transition">
              Security Policy
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-900 transition">
              Terms of Access
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-slate-900 transition">
              NIC Cyber Incident Response Team
            </a>
            <span className="font-mono text-slate-400">Server Node: DEL-NIC-04</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
