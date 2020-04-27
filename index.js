const { pipeline, Writable } = require("stream");
const { safeMemoryCache } = require("safe-memory-cache");
const storage = safeMemoryCache({ limit: 10000, maxTTL: 24 * 60 * 60 * 1000 });

const log = console.log;
const httpErr = (res, err) => {
  log(err);
  res.writeHead(500);
  res.end("err");
};

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
const compileKey = (r) =>
  `vd:${r["violated-directive"]};
  bu:${(r["blocked-uri"] || "-").split(":")[0]};
  sf:${r["source-file"]};
  pos:${r["line-number"]}/${r["column-number"]};
  du:${r["document-uri"]}`;

const isSpam = (r) => {
  const sourceProto = r["source-file"] && r["source-file"].split(":")[0];
  return sourceProto && sourceProto.includes("extension");
};
const acceptReport = (report, userAgent) => {
  let key;
  if (isSpam(report)) {
    key = "spam";
  } else {
    key = compileKey(report);
  }
  let count = storage.get(key) || 0;
  if (count % 10 === 0) {
    log(key, "\n", count, report, userAgent);
  }
  count++;
  storage.set(key, count);
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
        acceptReport(bodyObj["csp-report"], userAgent);
      }
    } catch (e) {
      httpErr(res, e);
    }
    res.writeHead(200);
    res.end("ok");
  });
};
