# node-express-metrics

Express middleware to log metrics traces

[![npm version](https://badge.fury.io/js/node-express-metrics.svg)](http://badge.fury.io/js/node-express-metrics)
[![Build Status](https://travis-ci.org/telefonica/node-express-metrics.svg)](https://travis-ci.org/telefonica/node-express-metrics)
[![Coverage Status](https://img.shields.io/coveralls/telefonica/node-express-metrics.svg)](https://coveralls.io/r/telefonica/node-express-metrics)

This express middleware gathers the metrics information from a **metrics** object stored in the process [domain](https://nodejs.org/api/domain.html): **process.domain.metrics**.

For each request, the middleware initializes the metrics object, and at the end of the response logs the information stored in the metrics object. It is responsibility of the service logic to enrich this metrics object.

## Installation

```bash
npm install node-express-metrics
```

## Basic usage

```js
var express = require('express'),
    logger = require('logops'),
    expressDomain = require('express-domaining'),
    expressTracking = require('express-tracking'),
    expressMetrics = require('node-express-metrics');

var app = express();
app.use(expressDomain(logger));
app.use(expressTracking({op: 'test'}));
app.use(expressMetrics(logger));

app.get('/version', function(req, res) {
   //Add metrics information
   var metrics = process.domain.metrics;
   metrics.operationStatus = 'ok';
   metrics.clientAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
   res.status(200).json({version: '1.0.0'});
});

app.listen(3000);
```

## Options

The express middleware may receive an object with optional settings:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| logger | Object | null | logger module ({info: function(msg, metricsObject)}) |


## Full example

It is recommended to use this express middleware in combination with:

* [express-domaining](https://github.com/telefonica/node-express-domaining). Express middleware to automatically create and destroy a [domain](https://nodejs.org/api/domain.html).
* [express-logging](https://github.com/telefonica/node-express-logging). Express middleware to log each request and response.
* [express-tracking](https://github.com/telefonica/node-express-tracking). Express middleware to track the request and response storing in the domain the operation, transactionId and correlator.

```js
var express = require('express'),
    expressDomain = require('express-domaining'),
    expressTracking = require('express-tracking'),
    expressLogging = require('express-logging'),
    expressMetrics = require('node-express-metrics'),
    logger = require('logops');

logger.getContext = function() {
  return process.domain && process.domain.tracking;
};

var app = express();
app.use(expressDomain(logger));
app.use(expressTracking({op: 'test'}));
app.use(expressLogging(logger));
app.use(expressMetrics(logger));

app.get('/test', function(req, res) {
  res.status(200).send();
});

app.get('/version', function(req, res) {
   //Add metrics information
   var metrics = process.domain.metrics;
   metrics.operationStatus = 'ok';
   metrics.clientAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
   res.status(200).json({version: '1.0.0'});
});

app.listen(3000);
```

After launching the previous server, each HTTP request generates 2 log entries to trace the request and response:

```json
{"time":"2015-07-08T20:31:25.210Z","lvl":"INFO","corr":"7a051a2b-e3e8-4625-a680-1ae30105cdda","trans":"7a051a2b-e3e8-4625-a680-1ae30105cdda","op":"test","msg":"Request from 127.0.0.1: GET /version"}
{"time":"2015-07-08T20:31:25.212Z","lvl":"INFO","corr":"7a051a2b-e3e8-4625-a680-1ae30105cdda","trans":"7a051a2b-e3e8-4625-a680-1ae30105cdda","op":"test","msg":"Response with status 304 in 3 ms."}
{"time":"2015-07-08T20:31:25.214Z","lvl":"INFO","corr":"7a051a2b-e3e8-4625-a680-1ae30105cdda","trans":"7a051a2b-e3e8-4625-a680-1ae30105cdda","op":"test","msg":"metrics","operationStatus":"ok","clientAddress":"127.0.0.1"}
```


## License

Copyright 2015 [Telefónica Investigación y Desarrollo, S.A.U](http://www.tid.es)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
