const { pipeline, Writable } = require("stream");
const { reportAggregator } = require("./report");

module.exports = {
  requestHandler(options) {
    const maxBytes = options.maxBytes || 50000;
    const log = options.logger || console.log;
    const acceptReport = reportAggregator(options);

    const httpErr = (res, err) => {
      log(err);
      res.writeHead(500);
      res.end("err");
    };

    return function (req, res) {
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
          const userAgent = req.headers["user-agent"];
          if (bodyObj && bodyObj["csp-report"]) {
            acceptReport({
              report: bodyObj["csp-report"],
              userAgent: userAgent,
            });
          }
        } catch (e) {
          httpErr(res, e);
        }
        res.writeHead(200);
        res.end("ok");
      });
    };
  },
};
