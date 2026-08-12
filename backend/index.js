import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import dnsRoutes from './src/routes/dns.routes.js'
import webRoutes from './src/routes/web.routes.js'
import sslRoutes from './src/routes/ssl.routes.js'
import domainRoutes from './src/routes/domain.routes.js'
import networkRoutes from './src/routes/network.routes.js'
import mailRoutes from './src/routes/mail.routes.js'
import wordpressRoutes from './src/routes/wordpress.routes.js'
import { errorHandler } from './src/middleware/errorHandler.js'

const app = express()
const port = Number(process.env.BACKEND_PORT || 3001)

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '32kb' }))
app.get('/health', (req, res) => res.json({ ok: true }))
app.use('/api/dns', dnsRoutes)
app.use('/api/web', webRoutes)
app.use('/api/ssl', sslRoutes)
app.use('/api/domain', domainRoutes)
app.use('/api/network', networkRoutes)
app.use('/api/mail', mailRoutes)
app.use('/api/wordpress', wordpressRoutes)
app.use((req, res) => res.status(404).json({ success: false, tool: 'unknown', target: null, duration: 0, data: null, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } }))
app.use(errorHandler)

app.listen(port)
