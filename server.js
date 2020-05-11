const http = require("http");

const { requestHandler } = require("./src/requestHandler");

http
  .createServer(
    requestHandler({
      cacheLimit: 10000,
      cacheTTL: 8000000,
      exponentialAggregation: true,
      logger: console.error,
      target: console.log,
      maxBytes: 50000,
    })
  )
  .listen(8000, console.log);
