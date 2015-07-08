'use strict';

var sinon = require('sinon');

var metricsModule = require('../../lib/metrics');

describe('Metrics Middleware Tests', function() {

  var logStub,
      oldConsoleLog = console.log;

  beforeEach(function(done) {
    process.domain = {
      // timer.js issues with domain
      enter: function() {},
      exit: function() {}
    };
    console.log = oldConsoleLog;
    done();
  });

  it('should log the metrics information if the middleware has a logger instance' +
      ' and metrics information' , function(done) {

    var writeMetricsMethod;
    logStub = {
      info: function(msg, context) {
      }
    };

    var nextMiddlewareStub = {
      next: function() {}
    };

    var logSpy = sinon.spy(logStub, 'info');
    var nextMiddlewareSpy = sinon.spy(nextMiddlewareStub, 'next');

    var res = {
      on: function(eventType, writeMetrics) {
        writeMetricsMethod = writeMetrics;
      }
    };

    var resSpy = sinon.spy(res, 'on');

    metricsModule(logStub)(null, res, nextMiddlewareStub.next);

    process.domain.metrics.info = 'info';
    process.domain.metrics.status = 'ok';

    expect(resSpy).to.have.calledOnce;
    expect(nextMiddlewareSpy).to.have.calledOnce;
    expect(logSpy).to.not.have.called;
    expect(writeMetricsMethod).to.exist;

    // call writeMetrics method
    writeMetricsMethod();
    expect(logSpy).to.have.calledWith('metrics', {info: 'info', status: 'ok'});
    done();

  });


  it('should call next middleware without domain', function() {
    process.domain = null;
    logStub = {
      info: function(msg, context) {
      }
    };

    var nextMiddlewareStub = {
      next: function() {}
    };

    var logSpy = sinon.spy(logStub, 'info');
    var nextMiddlewareSpy = sinon.spy(nextMiddlewareStub, 'next');

    metricsModule(logStub)(null, null, nextMiddlewareStub.next);

    expect(nextMiddlewareSpy).to.have.calledOnce;
    expect(logSpy).to.not.have.called;

  });

  it('should write to console the metric trace if the logger does not exist' , function(done) {

    var writeMetricsMethod;

    var nextMiddlewareStub = {
      next: function() {}
    };

    var nextMiddlewareSpy = sinon.spy(nextMiddlewareStub, 'next');

    var res = {
      on: function(eventType, writeMetrics) {
        writeMetricsMethod = writeMetrics;
      }
    };

    var consoleStub = {
      log: function(msg, context) {}
    };

    var resSpy = sinon.spy(res, 'on');
    var consoleSpy = sinon.spy(consoleStub, 'log');
    console.log = consoleStub.log;
    metricsModule()(null, res, nextMiddlewareStub.next);

    process.domain.metrics.info = 'info';
    process.domain.metrics.status = 'ok';

    expect(resSpy).to.have.calledOnce;
    expect(nextMiddlewareSpy).to.have.calledOnce;
    expect(consoleSpy).to.not.have.called;
    expect(writeMetricsMethod).to.exist;

    // call writeMetrics method
    writeMetricsMethod();
    expect(consoleSpy).to.have.calledOnce;;
    expect(consoleSpy).to.have.calledWith('metrics', {info: 'info', status: 'ok'});
    done();

  });


  it('should not log the metrics information if the middleware has a logger instance' +
      ' and metrics is empty' , function(done) {

    var writeMetricsMethod;
    logStub = {
      info: function(msg, context) {
      }
    };

    var nextMiddlewareStub = {
      next: function() {}
    };

    var logSpy = sinon.spy(logStub, 'info');
    var nextMiddlewareSpy = sinon.spy(nextMiddlewareStub, 'next');

    var res = {
      on: function(eventType, writeMetrics) {
        writeMetricsMethod = writeMetrics;
      }
    };

    var resSpy = sinon.spy(res, 'on');

    metricsModule(logStub)(null, res, nextMiddlewareStub.next);


    expect(resSpy).to.have.calledOnce;
    expect(nextMiddlewareSpy).to.have.calledOnce;
    expect(logSpy).to.not.have.called;
    expect(writeMetricsMethod).to.exist;

    // call writeMetrics method
    writeMetricsMethod();
    expect(logSpy).to.not.have.called;
    done();

  });


  after(function(done) {
    console.log = oldConsoleLog;
    process.domain = null;
    done();
  });



});
