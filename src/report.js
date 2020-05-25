const { safeMemoryCache } = require("safe-memory-cache");

const isExtension = (r) => {
  const sourceProto = r["source-file"] && r["source-file"].split(":")[0];
  return sourceProto && sourceProto.includes("extension");
};

const skipExtensions = (aggrFunction) => {
  return (r) => {
    if (isExtension(r)) {
      return "extension";
    }
    return aggrFunction(r);
  };
};

const aggregations = {
  // verbosity: 5
  allUnique: (r) => JSON.stringify(r),
  // verbosity: 4
  uniqueNoExt: skipExtensions((r) => JSON.stringify(r)),
  // verbosity: 3
  allBlockedUris: skipExtensions((r) =>
    [
      `vd:${r["violated-directive"]};`,
      `bu:${r["blocked-uri"] || "-"};`,
      `sf:${r["source-file"]};`,
      `pos:${r["line-number"]}/${r["column-number"]};`,
      `du:${r["document-uri"]};`,
    ].join("")
  ),
  // verbosity: 2
  default: skipExtensions((r) =>
    [
      `vd:${r["violated-directive"]};`,
      `bu:${(r["blocked-uri"] || "-").split(":")[0]};`,
      `sf:${r["source-file"]};`,
      `pos:${r["line-number"]}/${r["column-number"]};`,
      `du:${r["document-uri"]};`,
    ].join("")
  ),
  // verbosity: 1
  sampleDirective: skipExtensions((r) =>
    [`vd:${r["violated-directive"]};`, `du:${r["document-uri"]};`].join("")
  ),
};

module.exports = {
  reportAggregator({
    cacheLimit = 10000,
    cacheTTL = 24 * 60 * 60 * 1000,
    exponentialAggregation = "default",
    target,
  }) {
    const storage = safeMemoryCache({
      limit: cacheLimit,
      maxTTL: cacheTTL,
    });

    target = target || console.log;

    const compileKey = aggregations[exponentialAggregation];

    const isPowerOf10 = (num) => Math.log10(num) % 1 === 0;

    const acceptReport = ({ report, customFields }) => {
      
      if (exponentialAggregation) {
        const key = compileKey(report);
        let count = storage.get(key) || 1;
        if (isPowerOf10(count)) {
          target({ key, count, report, ...customFields });
        }
        count++;
        storage.set(key, count);
      } else {
        target({ report, ...customFields });
      }
    };

    return acceptReport;
  },
};
