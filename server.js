// @ts-check

const http = require("http");

const { requestHandler } = require("./");

http
  .createServer(
    requestHandler({
      beforeReport: (req) => ({ 
        userAgent: req.headers["user-agent"],
        host: req.headers["host"],
        xff: req.headers["x-forwarded-for"]
      }),
      cacheLimit: 10000,
      cacheTTL: 8000000,
      exponentialAggregation: "default",
      logger: console.error,
      target: (rep) => console.log(JSON.stringify(rep)),
      maxBytes: 50000,
    })
  )
  .listen(process.env.PORT || 8000, () => console.log("started"));
 