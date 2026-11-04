import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminNavbar from './AdminNavbar'

const MainPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { pathname } = useLocation()

  // Page change hone par mobile drawer band
  useEffect(() => setMobileOpen(false), [pathname])

  // Esc dabane par drawer band
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMobileOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Drawer khula ho to background scroll lock
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleMenu = () => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    if (isDesktop) setCollapsed((c) => !c)
    else setMobileOpen((o) => !o)
  }

  return (
    <div className="min-h-screen bg-[#f3f5f4] text-slate-800 antialiased">
      <AdminSidebar
        open={mobileOpen}
        collapsed={collapsed}
        onClose={() => setMobileOpen(false)}
      />

      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:ml-[76px]' : 'lg:ml-64'
        }`}
      >
        <AdminNavbar onMenuClick={handleMenu} />

        {/* Aapke saare child pages yahin load honge */}
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainPage