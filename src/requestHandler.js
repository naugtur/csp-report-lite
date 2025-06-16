const { pipeline, Writable } = require("stream");
const { reportAggregator } = require("./report");

/** @typedef {import('./report').ReportAggregatorOptions} ReportAggregatorOptions */

/**
 * @typedef RequestHandlerSpecificOptions
 * @property {number} [maxBytes=50000] Maximum number of bytes allowed in the request body (to avoid DoS, but accept long reports)
 * @property {(err: any) => void} [logger=console.log] Function to call for logging errors (as opposed to writing the reports)
 * @property {(req: import('http').IncomingMessage) => Record<string, any>} [beforeReport] Function to extract custom fields from the request before processing. Default extracts user-agent.
 *
 * @typedef {ReportAggregatorOptions&RequestHandlerSpecificOptions} RequestHandlerOptions
 */

/**
 * @param {import('http').IncomingMessage} req
 * @returns {{userAgent: string|undefined}}
 */
const defaultBeforeReport = (req) => ({ userAgent: req.headers["user-agent"] });

module.exports = {
  /**
   * @param {RequestHandlerOptions} options
   * @returns {(req: import('http').IncomingMessage, res: import('http').ServerResponse) => void}
   */
  requestHandler(options) {
    const maxBytes = options.maxBytes || 50000;
    const log = options.logger || console.log;
    /** @type {(data: { report: any, customFields: Record<string, any> }) => void} */
    const acceptReport = reportAggregator({ ...options, target: log });
    const beforeReport = options.beforeReport || defaultBeforeReport;

    /**
     * @param {import('http').ServerResponse} res
     * @param {Error|unknown} err
     * @returns {void}
     */
    const httpErr = (res, err) => {
      log(err);
      res.writeHead(500);
      res.end("err");
    };

    /**
     * @param {import('http').IncomingMessage} req
     * @param {import('http').ServerResponse} res
     */
    return function (req, res) {
      if (req.method === "GET") {
        return res.end();
      }
      if (req.method === "OPTIONS") {
        // DOH https://bugs.chromium.org/p/chromium/issues/detail?id=1152867
        res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        return res.end();
      }

      // Theoretically these are the only two content types this should consume.
      // Not sure if we can count on that always being the case
      // contentType === "application/csp-report"
      // contentType === "application/reports+json"

      let body = "";
      const writable = new Writable({
        /**
         * @param {Buffer} chunk
         * @param {string} enc
         * @param {(error?: Error | null) => void} cb
         * @returns {void}
         */
        write(chunk, enc, cb) {
          const chunkString = chunk.toString();
          if (body.length === 0) {
            if (chunkString[0] !== "{") {
              return cb(Error("input body not json"));
            }
          }
          body += chunkString;
          if (body.length > maxBytes) {
            return cb(Error("input body too long"));
          }
          cb();
        },
      });

      pipeline(
        req,
        writable,
        /** @param {NodeJS.ErrnoException | null} err */ (err) => {
          if (err) {
            httpErr(res, err);
          }
          if (!body.length) {
            return res.end();
          }
          try {
            const bodyObj = JSON.parse(body);
            const customFields = beforeReport(req);
            if (bodyObj && bodyObj["csp-report"]) {
              acceptReport({
                report: bodyObj["csp-report"],
                customFields,
              });
            }
          } catch (e) {
            httpErr(res, e);
          }
          res.writeHead(200);
          res.end();
        }
      );
    };
  },
};
