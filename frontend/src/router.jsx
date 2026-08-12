import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import DnsLookup from './pages/dns/DnsLookup'
import HttpStatus from './pages/web/HttpStatus'
import WhoisLookup from './pages/domain/WhoisLookup'
import NetworkConnectivity from './pages/network/NetworkConnectivity'
import { ToolPage } from './pages/ToolPage'

const dnsRoutes = [
  ['propagation', 'dns-propagation'], ['records', 'dns-record-inspector'], ['dnssec', 'dnssec-analyzer'],
  ['nameservers', 'nameserver-checker'], ['cname-chain', 'cname-chain'], ['ttl', 'ttl-analyzer'],
  ['reverse', 'reverse-dns'], ['ip-versions', 'ip-versions'], ['authoritative', 'authoritative-dns']
]

const mailRoutes = [
  ['mx', 'mail-mx-lookup'], ['smtp-test', 'mail-smtp-test'], ['smtp-banner', 'mail-smtp-banner'],
  ['spf', 'mail-spf-analyzer'], ['dkim', 'mail-dkim-analyzer'], ['dmarc', 'mail-dmarc-analyzer'],
  ['ptr', 'mail-ptr-lookup'], ['tls', 'mail-tls-check'], ['starttls', 'mail-starttls'],
  ['blacklist', 'mail-blacklist-check'], ['connectivity', 'mail-smtp-connectivity']
]

const sslRoutes = [
  ['certificate', 'ssl-certificate'], ['issuer', 'ssl-issuer'], ['expiration', 'ssl-expiration'],
  ['san', 'ssl-san'], ['chain', 'ssl-chain'], ['tls12', 'ssl-tls12'], ['tls13', 'ssl-tls13'],
  ['cipher', 'ssl-cipher'], ['ocsp', 'ssl-ocsp'], ['hsts', 'ssl-hsts'], ['ct', 'ssl-ct']
]

const wordpressRoutes = [
  ['version', 'wordpress-version'], ['php', 'wordpress-php'], ['theme', 'wordpress-theme'],
  ['plugins', 'wordpress-plugins'], ['rest-api', 'wordpress-rest-api'], ['xmlrpc', 'wordpress-xmlrpc'],
  ['wp-login', 'wordpress-wp-login'], ['wp-json', 'wordpress-wp-json'],
  ['security-headers', 'wordpress-security-headers'], ['mixed-content', 'wordpress-mixed-content'],
  ['ssl', 'wordpress-ssl'], ['performance', 'wordpress-performance'], ['cache', 'wordpress-cache'],
  ['db-hints', 'wordpress-db-hints'], ['vuln-signals', 'wordpress-vuln-signals']
]

const webRoutes = [
  ['redirect-chain', 'web-redirect-chain'], ['ssl', 'web-ssl'], ['certificate', 'web-certificate'],
  ['security-headers', 'web-security-headers'], ['http-headers', 'web-http-headers'], ['compression', 'web-compression'],
  ['http2', 'web-http2'], ['http3', 'web-http3'], ['response-time', 'web-response-time'], ['server', 'web-server'],
  ['cdn', 'web-cdn'], ['techstack', 'web-techstack'], ['whois', 'web-whois']
]

export function AppRouter() {
  return <BrowserRouter><AppLayout><Routes><Route path="/" element={<Dashboard />} /><Route path="/dns/lookup" element={<DnsLookup />} />{dnsRoutes.map(([path, toolId]) => <Route key={toolId} path={`/dns/${path}`} element={<ToolPage toolId={toolId} />} />)}{mailRoutes.map(([path, toolId]) => <Route key={toolId} path={`/mail/${path}`} element={<ToolPage toolId={toolId} />} />)}{wordpressRoutes.map(([path, toolId]) => <Route key={toolId} path={`/wordpress/${path}`} element={<ToolPage toolId={toolId} />} />)}{sslRoutes.map(([path, toolId]) => <Route key={toolId} path={`/ssl/${path}`} element={<ToolPage toolId={toolId} />} />)}{webRoutes.map(([path, toolId]) => <Route key={toolId} path={`/web/${path}`} element={<ToolPage toolId={toolId} />} />)}<Route path="/web/http-status" element={<HttpStatus />} /><Route path="/domain/whois" element={<WhoisLookup />} /><Route path="/network/connectivity" element={<NetworkConnectivity />} /><Route path="*" element={<Dashboard />} /></Routes></AppLayout></BrowserRouter>
}
