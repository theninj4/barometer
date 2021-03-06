/* global window */
'use strict'
var sinon = require('sinon')
require('./_fakeDom.js')
require('../lib/xhrStats.js')
var transport = require('../lib/transport.js')

describe('Testing xhrStats', function () {
  before(function () {
    sinon.stub(transport, 'gauge')
    sinon.stub(transport, 'count')
    window.clock = sinon.useFakeTimers()
    var xhr = new window.XMLHttpRequest()
    xhr.open('POST', 'www.example.com/foo', true)
    xhr.send('datadatadatadata')
  })
  after(function () {
    transport.gauge.restore()
    transport.count.restore()
    window.clock.restore()
  })

  it('should measure XHR timings', function () {
    sinon.assert.calledWith(transport.gauge, 'xhr.timing.POST.www_example_com/foo.total', 0)
    sinon.assert.calledWith(transport.gauge, 'xhr.timing.POST.www_example_com/foo.UNSENT', 0)
    sinon.assert.calledWith(transport.gauge, 'xhr.timing.POST.www_example_com/foo.OPENED', 0)
    sinon.assert.calledWith(transport.gauge, 'xhr.timing.POST.www_example_com/foo.HEADERS_RECEIVED', 0)
    sinon.assert.calledWith(transport.gauge, 'xhr.timing.POST.www_example_com/foo.LOADING', 0)
    sinon.assert.calledWith(transport.gauge, 'xhr.size.POST.www_example_com/foo.200', 11)
    sinon.assert.calledWith(transport.count, 'xhr.responses.POST.www_example_com/foo.200')
  })
})
