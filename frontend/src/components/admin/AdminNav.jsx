const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)

// Naya page add karna ho to bas yahan ek item add kar do
export const navItems = [
  { to: '/admin', label: 'Dashboard', end: true,
    icon: <Icon d="M3 13h8V3H3z M13 21h8v-8h-8z M13 3v6h8V3z M3 21h8v-6H3z" /> },
  { to: '/admin/users', label: 'Users',
    icon: <Icon d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8" /> },
  { to: '/admin/products', label: 'Products',
    icon: <Icon d="M21 8l-9-5-9 5v8l9 5 9-5z M3 8l9 5 9-5 M12 13v8" /> },
  { to: '/admin/orders', label: 'Orders',
    icon: <Icon d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0" /> },
  { to: '/admin/settings', label: 'Settings',
    icon: <Icon d="M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6" /> },
]