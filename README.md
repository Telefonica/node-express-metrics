# express-metrics

Express middleware to log metrics traces

[![npm version](https://badge.fury.io/js/express-metrics.svg)](http://badge.fury.io/js/express-metrics)
[![Build Status](https://travis-ci.org/telefonica/node-express-metrics.svg)](https://travis-ci.org/telefonica/node-express-metrics)
[![Coverage Status](https://img.shields.io/coveralls/telefonica/node-express-metrics.svg)](https://coveralls.io/r/telefonica/node-express-metrics)

## Installation

```bash
npm install express-metrics
```

## Basic usage

```js
var express = require('express'),
    logger = require('logops'),
    expressMetrics = require('express-metrics');

var app = express();
app.use(expressMetrics({logger: logger}));

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

## License

Copyright 2015 [Telefónica Investigación y Desarrollo, S.A.U](http://www.tid.es)

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
