import { useState } from 'react'

export function ToolInput({ loading, onSubmit, showDkimSelector = false }) {
  const [target, setTarget] = useState('')
  const [selector, setSelector] = useState('')

  function submit(event) {
    event.preventDefault()
    const options = showDkimSelector && selector.trim() ? { selector: selector.trim() } : {}
    onSubmit(target, options)
  }

  return <form className="tool-form" onSubmit={submit}>
    <label htmlFor="target">Domain</label>
    <div className="input-row">
      <input id="target" type="text" value={target} onChange={(event) => setTarget(event.target.value)} placeholder="example.com" autoComplete="url" disabled={loading} required />
      <button type="submit" disabled={loading}>{loading ? 'Memeriksa…' : 'Jalankan tool'}</button>
    </div>
    {showDkimSelector && <div className="input-row secondary-input">
      <input id="selector" type="text" value={selector} onChange={(event) => setSelector(event.event?.target?.value ?? event.target.value)} placeholder="Selector DKIM (opsional, contoh: google)" disabled={loading} />
    </div>}
    <p className="hint">Masukkan domain saja. Contoh: <code>example.com</code>{showDkimSelector ? ' (kosongkan selector untuk deteksi otomatis selector umum)' : ''}</p>
  </form>
}
