function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  URL.revokeObjectURL(url)
}

export function exportJson(result) {
  download(`${result.tool}-${result.target}.json`, JSON.stringify(result, null, 2), 'application/json')
}

function csvCell(value) {
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value ?? '')
  return `"${text.replaceAll('"', '""')}"`
}

export function exportCsv(result) {
  const rows = [['field', 'value'], ...Object.entries(result.data || {})]
  download(`${result.tool}-${result.target}.csv`, rows.map((row) => row.map(csvCell).join(',')).join('\r\n'), 'text/csv;charset=utf-8')
}
