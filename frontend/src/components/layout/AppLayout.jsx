import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navGroups } from '../../config/nav'
import { useTheme } from '../../hooks/useTheme'

export function AppLayout({ children }) {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [openCategory, setOpenCategory] = useState(null)
  const navRef = useRef(null)
  useEffect(() => {
    function close(event) {
      if (event.type === 'keydown' && event.key !== 'Escape') return
      if (event.type === 'mousedown' && navRef.current?.contains(event.target)) return
      setOpenCategory(null)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close) }
  }, [])
  return <div className="app-shell"><header className="site-header"><Link className="brand" to="/"><span>◌</span> Supertools</Link><div className="header-actions"><nav className="category-nav" aria-label="Navigasi kategori" ref={navRef}><NavLink to="/" end>Dashboard</NavLink>{navGroups.map(({ category, items }) => <div className="nav-group" key={category}><button className={`nav-trigger ${items.some((item) => location.pathname === item.path) ? 'active' : ''}`} type="button" aria-haspopup="menu" aria-expanded={openCategory === category} onClick={() => setOpenCategory((value) => value === category ? null : category)}>{category}<span>⌄</span></button>{openCategory === category && <div className="dropdown-menu" role="menu">{items.map((item) => <NavLink role="menuitem" key={item.id} to={item.path} onClick={() => setOpenCategory(null)}>{item.icon} {item.label}</NavLink>)}</div>}</div>)}</nav><button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}>{theme === 'dark' ? '☀' : '◐'}</button></div></header><main>{children}</main><footer>Supertools · Diagnostik domain lokal</footer></div>
}
