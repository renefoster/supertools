import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { tools } from '../config/tools'
import { getHistory, historyEnabled } from '../lib/history'
import { HistoryList } from '../components/tool/HistoryList'

export default function Dashboard() {
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const filtered = useMemo(() => tools.filter((tool) => `${tool.label} ${tool.description} ${tool.category}`.toLowerCase().includes(query.toLowerCase())), [query])
  useEffect(() => { getHistory().then(setHistory).catch(() => {}).finally(() => setHistoryLoading(false)) }, [])
  const categories = [...new Set(tools.map((tool) => tool.category))]
  return <div className="dashboard page-wrap">
    <section className="hero"><div className="hero-copy"><p className="eyebrow">DOMAIN INTELLIGENCE / LOCAL-FIRST</p><h1>Kenali domain Anda lebih dalam.</h1><p>Lima pemeriksaan inti untuk DNS, web, SSL, registrasi domain, dan network. Satu input, hasil yang bisa ditindaklanjuti.</p><div className="search-wrap"><span>⌕</span><input aria-label="Cari tool" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari tool, misalnya SSL atau DNS…" /></div></div><div className="hero-art"><span>●</span><span>◌</span><span>✦</span></div></section>
    <section className="tool-section"><div className="section-heading"><div><p className="eyebrow">TOOLS / {filtered.length} DARI {tools.length}</p><h2>Pilih pemeriksaan</h2></div>{query && <button className="text-button" onClick={() => setQuery('')}>Reset pencarian</button>}</div>{categories.map((category) => { const grouped = filtered.filter((tool) => tool.category === category); return grouped.length ? <div className="category-block" key={category}><div className="category-heading"><h3>{category}</h3><span>{grouped.length} tool</span></div><div className="tool-grid">{grouped.map((tool) => <Link className="tool-card" to={tool.path} key={tool.id}><span className="tool-icon">{tool.icon}</span><span className="tool-category">{tool.category}</span><h3>{tool.label}</h3><p>{tool.description}</p><span className="card-arrow">↗</span></Link>)}</div></div> : null })}{!filtered.length && <p className="empty-state">Tool tidak ditemukan. Coba kata kunci lain.</p>}</section>
    <HistoryList history={history} unavailable={!historyEnabled()} loading={historyLoading} />
  </div>
}
