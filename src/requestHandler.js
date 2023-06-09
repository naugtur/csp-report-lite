const { pipeline, Writable } = require("stream");
const { reportAggregator } = require("./report");

const defaultBeforeReport = (req) => ({ userAgent: req.headers["user-agent"] });

module.exports = {
  requestHandler(options) {
    const maxBytes = options.maxBytes || 50000;
    const log = options.logger || console.log;
    const acceptReport = reportAggregator(options);
    const beforeReport = options.beforeReport || defaultBeforeReport;

    const httpErr = (res, err) => {
      log(err);
      res.writeHead(500);
      res.end("err");
    };

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

      // Theoretically these are the only two contrnt types this should conume.
      // Not sure if we can count on that always being the case
      // contentType === "application/csp-report"
      // contentType === "application/reports+json"

      let body = "";
      const writable = new Writable({
        write(chunk, enc, cb) {
          try {
            const chunkString = chunk.toString();
            if (body.length === 0) {
              if (chunkString[0] !== "{") {
                throw Error("input body not json");
              }
            }
            body += chunkString;
            if (body.length > maxBytes) {
              throw Error("input body too long");
            }
            cb();
          } catch (err) {
            cb(err);
          }
        },
      });

      pipeline(req, writable, (err) => {
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
      });
    };
  },
};
