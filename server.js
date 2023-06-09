// @ts-check

const http = require("http");

const { requestHandler } = require("./");
const port = process.env.PORT || 8000;

http
  .createServer(
    requestHandler({
      beforeReport: (req) => ({
        userAgent: req.headers["user-agent"],
        host: req.headers["host"],
        xff: req.headers["x-forwarded-for"],
      }),
      cacheLimit: 10000,
      cacheTTL: 8000000,
      exponentialAggregation: "default",
      logger: console.error,
      target: (rep) => {
        // key is really redundant the more verbose you go. Remove this line if you need to debug deduplication,
        //  other than that there's no point looking at long keys and you might as well set it to undefined.
        rep.key = rep.key.substring(0, 128);
        console.log(JSON.stringify(rep));
      },
      maxBytes: 50000,
    })
  )
  .listen(port, () => console.log("started on port " + port));
