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
      let body = "";
      const writable = new Writable({
        write(chunk, enc, cb) {
          try {
            body += chunk.toString();
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
