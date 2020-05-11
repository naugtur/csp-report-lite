/**
 * Aggregated Report
 * @typedef {Object} AggregatedReport
 * @property {string} key
 * @property {number} count
 * @property {Object} report
 * @property {string} userAgent
 */

/**
 * Target Callback - the function accepting the aggregated report
 * @callback TargetCallback
 * @param {AggregatedReport} aggregatedReport
 */

/**
 * Handler options
 * @typedef {Object} HandlerOptions
 * @property {number} maxBytes=50000
 * @property {function} logger - logger function, defaults to console.log
 * @property {TargetCallback} target - function accepting the aggregated report
 * @property {number} cacheLimit=10000
 * @property {number} cacheTTL=86400000
 * @property {boolean} exponentialAggregation=true
 */

/**
 * Aggregator options
 * @typedef {Object} AggrOptions
 * @property {TargetCallback} target - function accepting the aggregated report
 * @property {number} cacheLimit=10000
 * @property {number} cacheTTL=86400000
 * @property {boolean} exponentialAggregation=true
 */

/**
 * Request Handler
 * @callback RequestHandler
 * @param {Request} req
 * @param {Response} res
 */

/**
 * Accept Report
 * @callback AcceptReport
 * @param {ReportInput} reportInput
 */

 // TODO
// { 'blocked-uri': 'eval',
//   'column-number': 40017,
//   'document-uri': 'https://',
//   'line-number': 38,
//   'original-policy':
//    'default-src \'self\'; script-src \'self\' (...); report-uri http://localhost:8000/',
//   referrer: '',
//   'source-file':
//    'https://(..)/main.bundle.js',
//   'violated-directive': 'script-src' }
module.exports = {
  /**
   * requestHandler factory function
   * @param  {HandlerOptions} options
   * @returns {RequestHandler}
   */
  requestHandler: require("./src/requestHandler").requestHandler,
  /**
   * reportAggregator factory function
   * @param  {AggrOptions} options
   * @returns {AcceptReport}
   */
  reportAggregator: require("./src/report").reportAggregator,
};
