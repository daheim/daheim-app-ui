import Express from 'express'
import http from 'http'
import React from 'react'
import ReactDOM from 'react-dom/server'
import httpProxy from 'http-proxy'
import cookieParser from 'cookie-parser'
import path from 'path'

import universal from './universal'
import Html from './html'

const app = new Express()
const server = new http.Server(app)

const targetUrl = 'http://localhost:3000/api'
const proxy = httpProxy.createProxyServer({ target: targetUrl })

app.use(cookieParser())
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
  const address = listener.address().family === 'IPv6' ? `[${listener.address().address}]` : listener.address().address
  console.info('----\n==> ✅  %s is running, talking to API server on %s.', 'The Traveller UI', targetUrl)
  console.info('==> 💻  Open http://%s:%s in a browser to view the app.', address, listener.address().port)
})

