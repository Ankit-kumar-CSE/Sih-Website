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
              </div>
              <p className="text-[11px] text-slate-300 tracking-normal">
                National Agriculture Procurement Command & Control Grid • Ministry of Agriculture & Farmers Welfare
              </p>
            </div>
          </div>

          {/* Quick Portal Meta & Language switcher */}
          
        </header>
      </div>

      {/* Main Content Gateway Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      

        {/* Right Column: Interactive Login & 2FA Gateway Form */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
            {/* Gateway Card Header */}
            <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 px-7 py-5 text-white border-b border-brand-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
                  <span>Secure Official Sign-In</span>
                </h2>
              </div>
              <div className="text-right">
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 md:p-8 space-y-5">
              {/* Step 1: Officer Identification */}
              <div>
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
                    
                  </div>
                </div>
          
               
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
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
                  </button>
                </div>
              </div>

              {/* 2FA & Multi-Factor Section */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                    <span>Two-Factor Authentication (Aadhaar / TOTP)</span>
                  </label>
                  <span className="text-[11px] text-brand-700 font-medium hover:underline cursor-pointer">
                    Resend OTP
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
              
              </div>


              {/* Primary Submit Action */}
              <div className="pt-2">
                <button
                  onClick={handleAuthenticate}
                  disabled={authenticating}
                  className="w-full bg-brand-900 hover:bg-brand-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-brand-900/25 flex items-center justify-center space-x-2.5 transition duration-150 transform active:scale-[0.99] disabled:opacity-80 disabled:cursor-wait"
                >
                 
                  <span className="tracking-wide text-sm font-semibold uppercase">
                    {authenticating
                      ? 'Logging In...'
                      : 'Login'}
                  </span>
                  
                </button>
              </div>
            </div>

            {/* Card Security Footer */}
            
          </div>
        </div>
      </main>

      {/* Bottom Sovereign Footer */}
      
    </div>
  )
}
