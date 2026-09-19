import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EMBLEM_SRC } from '../components/AppShell'
import { useAdminAuth } from '../store/adminAuth'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAdminAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('national@kisanraw.gov.in')
  const [password, setPassword] = useState('Admin@1234')
  const [authenticating, setAuthenticating] = useState(false)
  const [loginError, setLoginError] = useState(null)

  const handleAuthenticate = async () => {
    setAuthenticating(true)
    setLoginError(null)
    const result = await login(email, password)
    if (result.success) {
      navigate('/national-command')
    } else {
      setLoginError(result.error || 'Login failed. Please check your credentials.')
      setAuthenticating(false)
    }
  }

  return (
    <div className="bg-slate-100 text-slate-900 min-h-screen flex flex-col antialiased">
      {/* Header */}
      <header className="bg-brand-950 border-b border-brand-800/80 px-6 py-3 text-white flex items-center gap-3 shadow-sm">
        <img
          src={EMBLEM_SRC}
          alt="KisanRaw Emblem"
          className="w-9 h-9 object-contain"
        />
        <div>
          <div className="font-extrabold tracking-wider text-base uppercase text-white">
            KisanRaw Centre Operations
          </div>
          <p className="text-[11px] text-slate-300 tracking-normal">
            National Agriculture Procurement Command &amp; Control Grid &bull; Ministry of Agriculture &amp; Farmers Welfare
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 px-7 py-5 text-white">
              <h1 className="text-xl font-bold tracking-tight">Official Sign-In</h1>
              <p className="text-sm text-slate-300 mt-0.5">Access restricted to authorised personnel only.</p>
            </div>

            {/* Form */}
            <div className="p-6 md:p-8 space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Officer ID / Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 transition"
                    placeholder="e.g. officer.id@gov.in"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Password
                  </label>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-brand-700 font-semibold hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAuthenticate()}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" x2="23" y1="1" y2="23"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {loginError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700 font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
                  </svg>
                  {loginError}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleAuthenticate}
                disabled={authenticating}
                className="w-full bg-brand-900 hover:bg-brand-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-brand-900/25 flex items-center justify-center gap-2 transition duration-150 active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait"
              >
                {authenticating ? (
                  <>
                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/>
                    </svg>
                    Sign In
                  </>
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="px-7 py-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
              Authorised access only &bull; All sessions are logged &bull; &copy; Ministry of Agriculture &amp; Farmers Welfare
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
