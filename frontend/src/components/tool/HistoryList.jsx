import { Link } from 'react-router-dom'
import { toolById } from '../../config/tools'

export function HistoryList({ history, unavailable, loading }) {
  return <section className="history"><div className="section-heading"><div><p className="eyebrow">Riwayat browser</p><h2>Pemeriksaan terbaru</h2></div></div>{loading ? <p>Memuat riwayat…</p> : unavailable ? <p className="muted">Tambahkan konfigurasi Supabase untuk menyimpan riwayat.</p> : history.length ? <ul>{history.map((item) => <li key={item.id}><Link to={toolById[item.tool]?.path || '/'}><span>{toolById[item.tool]?.icon || '•'}</span><div><strong>{item.target}</strong><small>{toolById[item.tool]?.label || item.tool} · {item.duration} ms</small></div><time>{new Date(item.created_at).toLocaleString('id-ID')}</time></Link></li>)}</ul> : <p className="muted">Belum ada riwayat pada browser ini.</p>}</section>
}
