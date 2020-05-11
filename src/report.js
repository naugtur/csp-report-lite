const { safeMemoryCache } = require("safe-memory-cache");

module.exports = {
  reportAggregator({
    cacheLimit = 10000,
    cacheTTL = 24 * 60 * 60 * 1000,
    exponentialAggregation = true,
    target,
  }) {
    const storage = safeMemoryCache({
      limit: cacheLimit,
      maxTTL: cacheTTL,
    });

    target = target || console.log;

    const compileKey = (r) =>
      [
        `vd:${r["violated-directive"]};`,
        `bu:${(r["blocked-uri"] || "-").split(":")[0]};`,
        `sf:${r["source-file"]};`,
        `pos:${r["line-number"]}/${r["column-number"]};`,
        `du:${r["document-uri"]};`,
      ].join("");

    const isExtension = (r) => {
      const sourceProto = r["source-file"] && r["source-file"].split(":")[0];
      return sourceProto && sourceProto.includes("extension");
    };

    const isPowerOf10 = (num) => Math.log10(num) % 1 === 0;

    const acceptReport = ({ report, userAgent }) => {
      let key;
      if (isExtension(report)) {
        key = "extension";
      } else {
        key = compileKey(report);
      }
      let count = storage.get(key) || 1;
      if (exponentialAggregation) {
        if (isPowerOf10(count)) {
          target({ key, count, report, userAgent });
        }
      } else {
        target({ key, count, report, userAgent });
      }
      count++;
      storage.set(key, count);
    };

    return acceptReport;
  },
};
