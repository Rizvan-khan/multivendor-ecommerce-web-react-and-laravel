import React from 'react'
import { useLocation } from 'react-router-dom'
import { navItems } from './AdminNav'

const AdminNavbar = ({ onMenuClick }) => {
  const { pathname } = useLocation()
  const title = navItems.find((i) => i.to === pathname)?.label ?? 'Admin'

  const iconBtn =
    'relative grid h-10 w-10 place-items-center rounded-xl transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f2b134]'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/85 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button onClick={onMenuClick} aria-label="Toggle sidebar" className={iconBtn}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
             strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      </button>

      <h1 className="text-lg font-bold tracking-tight text-slate-800">{title}</h1>

      {/* Search: mobile par hidden */}
      <label className="ml-auto hidden h-10 w-full max-w-xs items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-500 transition-colors focus-within:border-[#0e2a2b] focus-within:bg-white sm:flex">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
             strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          type="search"
          placeholder="Search karo…"
          aria-label="Search"
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />
      </label>

      <div className="ml-auto flex items-center gap-1.5 sm:ml-0">
        <button aria-label="Notifications" className={iconBtn}>
          <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor"
               strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9 M10.3 21a2 2 0 0 0 3.4 0" />
          </svg>
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
        </button>

        <button
          aria-label="Profile"
          className="ml-1 grid h-10 w-10 place-items-center rounded-full bg-[#0e2a2b] text-[13px] font-bold text-[#f2b134] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f2b134]"
        >
          AD
        </button>
      </div>
    </header>
  )
}

export default AdminNavbar