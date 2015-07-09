/**
 * @license
 * Copyright 2015 Telefónica Investigación y Desarrollo, S.A.U
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * Express middleware that log metrics traces at the end of the response process. This middleware uses
 * process.domain.metrics as source to get metrics information.
 *
 * @param {Object} logger
 *    logger instance
 * @return {Function(req, res, next)}
 *    Express middleware.
 */
module.exports = function(logger) {

  var loggerInfo = logger ? logger.info : console.log;

  return function(req, res, next) {
    var domain = process.domain;

    var writeMetrics = function writeMetrics() {
      var metricsKeys = Object.keys(domain.metrics);
      if (metricsKeys.length > 0) {
        loggerInfo('metrics', domain.metrics);
      }
    };

    if (domain) {
      domain.metrics = {};
      res.on('finish', writeMetrics);
    }

    next();
  };
};
