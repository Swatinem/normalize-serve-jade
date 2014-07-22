// this is mostly copied from https://github.com/normalize/koa.js/tree/master/example

var app = require('koa')()
var render = require('co-views')('.');

// overwrite app error logger to hide stupid
// RST: 5 errors when closing SSEs
var onerror = app.onerror
app.onerror = function (err, ctx) {
  if (err.code === 'ECONNRESET') return
  if (err.code === 'RST_STREAM') return
  onerror.call(app, err, ctx)
}

// hide favicon requests from logs
app.use(function* (next) {
  if (this.request.path === '/favicon.ico') return this.response.status = 204
  yield* next
})

app.use(require('koa-logger')())

app.use(require('koa-compress')({
  // flush is needed for compress to work
  // with SSE events on some browsers like chrome
  flush: require('zlib').Z_SYNC_FLUSH
}))

app.use(require('koa-normalize')(app))

app.use(require('koa-static')('.'));

// serve the template
app.use(function* (next) {
  if (this.request.path !== '/') return yield* next
  this.normalize.push()

  this.response.body = yield render('index.jade', this)
})

// serve both HTTP and HTTPS/SPDY
module.exports = function (port, _done) {
  var http = require('http')
  var spdy = require('spdy')
  var keys = require('spdy-keys')

  if (typeof port === 'function') {
    done = port
    port = null
  }

  var pending = 2

  // http port
  port = parseInt(port || process.env.PORT || 3333)
  // https port
  port2 = port + 1

  var fn = app.callback()

  return {
    http: http.createServer(fn).listen(port, done),
    https: spdy.createServer(keys, fn).listen(port2, done)
  }

  function done(err) {
    if (err) throw err
    if (!--pending && _done) _done()
  }
}

if (!module.parent) module.exports()

