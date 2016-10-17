var generate = require('../../lib/generate')
var isStream = require('is-stream')
var data = generate(5 + (Math.random() * 20 | 0))
var ops = []

Object.keys(data).forEach(function (key) {
  ops.push({
    type: 'put',
    key: key,
    value: data[key]
  })
})

module.exports = require('../../lib/exercise')({
  dir: __dirname,
  prepare: function (db, callback) {
    db.batch(ops, callback)
  },
  exec: function (dir, mod, callback) {
    if (typeof mod !== 'function') {
      throw String('{error.mod.not_function}')
    }
    if (mod.length < 1) {
      throw String('{error.mod.not_long_enough}')
    }
    var result = mod(dir)
    if (!isStream(result)) {
      throw String('{error.result_no_stream}')
    }
    var data = []
    result.on('data', function (entry) {
      data.push(entry)
    })
    result.on('end', function () {
      callback(data)
    })
  }
})
