import Express from 'express'
import http from 'http'
import spdy from 'spdy'
import fs from 'fs'
import React from 'react'
import ReactDOM from 'react-dom/server'
import httpProxy from 'http-proxy'
import cookieParser from 'cookie-parser'
import path from 'path'

import universal from './universal'
import Html from './html'

const app = new Express()

function createServer () {
  if (process.env.USE_HTTPS === '1') {
    const options = {
      cert: fs.readFileSync(process.env.SSL_CERT),
      key: fs.readFileSync(process.env.SSL_KEY)
    }
    return new spdy.Server(options, app)
  } else {
    return new http.Server(app)
  }
}
const server = createServer()

const targetUrl = process.env.API_URL
const proxy = httpProxy.createProxyServer({ target: targetUrl, secure: process.env.INSECURE_API_PROXY !== '1' })

app.use(cookieParser())
app.use('/dist', Express.static(path.join(__dirname, '..', 'build')))
app.use(Express.static(path.join(__dirname, '..', 'static')))

app.use('/api', (req, res) => {
  proxy.web(req, res, { target: targetUrl })
})

proxy.on('error', (error, req, res) => {
  let json
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error)
  }
  if (!res.headersSent) {
    res.writeHead(500, { 'content-type': 'application/json' })
  }

  json = { error: 'proxy_error', reason: error.message }
  res.end(JSON.stringify(json))
})

app.use((req, res) => {
  if (process.env.NODE_ENV === 'development') {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    universal.refresh()
  }

  if (req.originalUrl !== '/auth' && !req.cookies.sid) { // TODO: proper sid check
    res.redirect('/auth')
    return
  }

  // const store = createStore(history, client)

  function hydrateOnClient () {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={universal.assets()} />))
  }

  hydrateOnClient()
  return
})

const listener = server.listen(process.env.PORT || 8080, (err) => {
  if (err) {
    console.error(err)
  }
  const protocol = process.env.USE_HTTPS === '1' ? 'https' : 'http'
  const address = listener.address().family === 'IPv6' ? `[${listener.address().address}]` : listener.address().address
  console.info('----\n==> ✅  %s is running, talking to API server on %s.', 'Daheim App UI', targetUrl)
  console.info('==> 💻  Open %s://%s:%s in a browser to view the app.', protocol, address, listener.address().port)
})

