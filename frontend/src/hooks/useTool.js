import { useState } from 'react'
import { saveHistory } from '../lib/history'

const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export function useTool(endpoint) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function run(body) {
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const response = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.error?.message || 'Tool gagal dijalankan')
      setData(result)
      saveHistory(result).catch(() => {})
      return result
    } catch (caught) {
      setError(caught.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { data, error, loading, run }
}
