var net = require('net')
var once = require('once')

/**
 * Detect if the network is up (do we have connectivity?)
 * @param {(error: boolean)=>void} cb Callback to execute once we know if we have connectivity or not
 * @param {Object} options Optional options
 * @param {number} options.port Port to connect to. Default: 80.
 * @param {string} options.host Host to connect to. Default: nodejs.org
 * @param {string} options.timeout The timeout to check in ms. Default: 5000
 * 
 * @return {boolean}
 */
module.exports = function (cb, options = undefined) {
  var socket = net.connect({
    port: options?.port || 80,
    host: options?.host || 'nodejs.org'
  })

  // If no 'error' or 'connect' event after 5s, assume network is down
  var timer = setTimeout(function () {
    done(new Error('timeout'))
  }, options?.timeout || 5000)

  var done = once(function (err) {
    clearTimeout(timer)
    socket.unref()
    socket.end()
    cb(!err) // eslint-disable-line standard/no-callback-literal
  })

  socket.on('error', done)
  socket.on('connect', done)
}
