import { Link } from 'react-router-dom'
import { tools } from '../config/tools'
import { useTool } from '../hooks/useTool'
import { ToolInput } from '../components/tool/ToolInput'
import { ToolResult } from '../components/tool/ToolResult'

export function ToolPage({ toolId }) {
  const tool = tools.find((item) => item.id === toolId)
  const { data, error, loading, run } = useTool(tool.endpoint)
  const isDkim = toolId === 'mail-dkim-analyzer'

  return <div className="page-wrap tool-page">
    <Link className="back-link" to="/">← Semua tools</Link>
    <section className="tool-intro">
      <span className="tool-icon large">{tool.icon}</span>
      <div>
        <p className="eyebrow">{tool.category} / DIAGNOSTIC</p>
        <h1>{tool.label}</h1>
        <p>{tool.description}</p>
      </div>
    </section>
    <ToolInput loading={loading} showDkimSelector={isDkim} onSubmit={(target, options) => run({ target, options })} />
    <ToolResult data={data} error={error} loading={loading} />
  </div>
}
