const http = require("http");

const { requestHandler } = require("./src/requestHandler");

http
  .createServer(
    requestHandler({
      cacheLimit: 10000,
      cacheTTL: 8000000,
      exponentialAggregation: true,
      logger: console.error,
      target: (rep) => console.log(JSON.stringify(rep)),
      maxBytes: 50000,
    })
  )
  .listen(process.env.PORT || 8000, () => console.log("started"));
