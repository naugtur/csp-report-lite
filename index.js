const { pipeline, Writable } = require("stream");
const log = console.log;
const httpErr = (res, err) => {
  log(err);
  res.writeHead(500);
  res.end("err");
};

module.exports = function (req, res) {
  let body = "";
  const writable = new Writable({
    write(chunk, enc, cb) {
      try {
        body += chunk.toString();
        if (body.length > 50000) {
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
        log(bodyObj["csp-report"], userAgent);
      }
    } catch (e) {
      httpErr(res, e);
    }
    res.writeHead(200);
    res.end("ok");
  });
};
