import React from 'react'
import { NavLink } from 'react-router-dom'
import { navItems } from './AdminNav'

const AdminSidebar = ({ open, collapsed, onClose }) => {
  const label = `whitespace-nowrap transition-opacity duration-200 ${collapsed ? 'lg:opacity-0' : ''}`

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        aria-label="Admin navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-hidden bg-[#0e2a2b] text-[#b9cdca]
          transition-all duration-300 ease-in-out
          ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          lg:translate-x-0 lg:shadow-none
          ${collapsed ? 'lg:w-[76px]' : 'lg:w-64'}`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-[18px] font-bold text-white">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[#f2b134] text-[#0e2a2b]">
            A
          </span>
          <span className={label}>Admin Panel</span>
        </div>

        {/* Links */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3.5 py-4">
          {navItems.map(({ to, label: text, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={text}
              className={({ isActive }) =>
                `group relative flex h-11 items-center gap-3.5 rounded-xl px-3 text-sm font-medium transition-colors
                 before:absolute before:-left-3.5 before:bottom-2.5 before:top-2.5 before:w-1 before:rounded-r
                 before:bg-[#f2b134] before:content-[''] before:transition-opacity
                 ${
                   isActive
                     ? 'bg-[#163b3d] font-semibold text-white before:opacity-100'
                     : 'before:opacity-0 hover:bg-[#163b3d] hover:text-white'
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`grid h-5 w-5 flex-none place-items-center ${isActive ? 'text-[#f2b134]' : ''}`}>
                    {icon}
                  </span>
                  <span className={label}>{text}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-white/10 px-[26px] py-4 text-xs">
          <span className="h-2 w-2 flex-none rounded-full bg-green-400" />
          <span className={label}>System Live</span>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar