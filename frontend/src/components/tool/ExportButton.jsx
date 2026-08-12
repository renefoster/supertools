import { exportCsv, exportJson } from '../../lib/export'

export function ExportButton({ result }) {
  if (!result) return null
  return <div className="export-actions"><span>Export hasil</span><button type="button" onClick={() => exportJson(result)}>JSON</button><button type="button" onClick={() => exportCsv(result)}>CSV</button></div>
}
