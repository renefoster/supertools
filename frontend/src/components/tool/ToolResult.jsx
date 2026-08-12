import { ExportButton } from './ExportButton'
import { StatusBadge } from '../ui/StatusBadge'
import { labelize, valueText } from '../../lib/formatValue'
import { getDnsMetrics } from '../../lib/dnsMetrics'

function Value({ value }) {
  if (value === null || value === undefined || value === '') return <span>—</span>
  if (Array.isArray(value)) return value.length ? <div className="value-list">{value.map((item, index) => <code key={index}>{typeof item === 'object' ? Object.entries(item).map(([key, child]) => `${labelize(key)}: ${valueText(child)}`).join(' · ') : valueText(item)}</code>)}</div> : <span>—</span>
  if (typeof value === 'object') return <div className="value-map">{Object.entries(value).map(([key, child]) => <div className="map-row" key={key}><span className="map-key">{labelize(key)}:</span><Value value={child} /></div>)}</div>
  return <span>{valueText(value)}</span>
}

function Metric({ label, value, tone = '' }) {
  return <div className={`metric ${tone}`}><span>{label}</span><strong>{valueText(value)}</strong></div>
}

function DnsVisual({ data }) {
  const metrics = getDnsMetrics(data)
  return <><div className="metrics"><Metric label="Records" value={metrics.recordCount} tone="lime" /><Metric label="IPv4" value={metrics.ipv4.length} /><Metric label="IPv6" value={metrics.ipv6.length} /></div><div className="ip-chips">{metrics.ips.map((ip) => <code key={ip}>{ip}</code>)}</div></>
}

function HttpVisual({ data }) { return <div className="metrics"><Metric label="HTTP status" value={data.status} tone={data.status >= 400 ? 'danger' : 'lime'} /><Metric label="Redirect" value={data.redirected ? 'Ya' : 'Tidak'} /><Metric label="Final URL" value={data.url} /></div> }
function SslVisual({ data }) { return <div className="metrics"><Metric label="Sisa masa berlaku" value={`${data.daysRemaining} hari`} tone={data.daysRemaining < 0 ? 'danger' : data.daysRemaining < 30 ? 'warn' : 'lime'} /><Metric label="Penerbit" value={data.issuer?.O || data.issuer?.CN} /><Metric label="Protocol" value={data.protocol} /></div> }
function WhoisVisual({ data }) { return <div className="metrics"><Metric label="Registrar" value={data.registrar || 'Tidak tersedia'} /><Metric label="Dibuat" value={data.created} /><Metric label="Kedaluwarsa" value={data.expires} /></div> }

function RecordInspector({ data }) {
  if (!data.records?.length) return <p className="empty-state">Tidak ada record yang dikembalikan resolver DoH.</p>
  return <div className="record-table">{data.records.map((record, index) => <div className="record-row" key={`${record.type}-${index}`}><strong>{record.type}</strong><span>{record.data || '—'}</span><small>{record.ttl ? `${record.ttl} detik` : 'TTL —'}</small></div>)}</div>
}

function Visual({ result }) {
  if (result.tool === 'dns-record-inspector') return <RecordInspector data={result.data} />
  if (result.tool.startsWith('dns-') || ['nameserver-checker', 'cname-chain', 'ttl-analyzer', 'reverse-dns', 'ip-versions', 'authoritative-dns'].includes(result.tool)) return <DnsVisual data={result.data} />
  if (result.tool === 'web-http-status') return <HttpVisual data={result.data} />
  if (result.tool === 'ssl-certificate') return <SslVisual data={result.data} />
  if (result.tool === 'domain-whois') return <WhoisVisual data={result.data} />
  if (result.tool === 'network-connectivity') return <><div className="metrics"><Metric label="Resolved IP" value={result.data.address} tone="lime" /><Metric label="Reachable" value={result.data.reachable ? 'Ya' : 'Tidak'} /><Metric label="Latency" value={`${result.data.latencyMs} ms`} /></div><div className="port-results">{result.data.ports?.map((port) => <div className="port-result" key={port.port}><strong>Port {port.port}</strong><span className={port.reachable ? 'port-open' : 'port-closed'}>{port.reachable ? 'OPEN' : port.error || 'CLOSED'}</span><small>{port.latencyMs} ms</small></div>)}</div></>
  return null
}

export function ToolResult({ data, error, loading }) {
  if (loading) return <section className="result-panel loading" aria-live="polite">Menjalankan diagnostik domain…</section>
  if (error) return <section className="result-panel error" role="alert"><strong>Tool gagal</strong><p>{error}</p></section>
  if (!data) return <section className="result-panel empty">Hasil pemeriksaan akan muncul di sini.</section>
  return <section className="result-panel" aria-live="polite"><header className="result-heading"><div><p className="eyebrow">{data.tool}</p><h2>{data.target}</h2></div><StatusBadge success={data.success}>Selesai · {data.duration} ms</StatusBadge></header><Visual result={data} /><dl className="result-grid">{Object.entries(data.data).filter(([key]) => !['raw', 'records'].includes(key)).map(([key, value]) => <div key={key}><dt>{labelize(key)}</dt><dd><Value value={value} /></dd></div>)}</dl>{data.data.raw && <details><summary>Lihat raw response terbatas</summary><pre className="raw-output">{data.data.raw}</pre></details>}<ExportButton result={data} /></section>
}
