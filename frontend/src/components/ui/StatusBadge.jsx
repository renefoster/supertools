export function StatusBadge({ success, children }) {
  return <span className={`badge ${success ? 'badge-success' : 'badge-error'}`}>{children}</span>
}
