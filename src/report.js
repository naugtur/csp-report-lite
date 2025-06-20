// @ts-expect-error no types there
const { safeMemoryCache } = require("safe-memory-cache");

/** @typedef {Object} ReportAggregatorOptions
 * @property {number} [cacheLimit] - maximum number of reports to keep in memory
 * @property {number} [cacheTTL] - time in milliseconds to keep reports in memory
 * @property {keyof typeof aggregations} [exponentialAggregation] - aggregation strategy to use
 * @property {(data: { key?: string, count?: number, report: Record<string, any>, [k: string]: any }) => void} [target] - function to call with the aggregated report
 */

/**
 * @param {Record<string, any>} r CSP report object
 * @returns {boolean}
 */
const isExtension = (r) => {
  const sourceProto = r["source-file"] && r["source-file"].split(":")[0];
  return sourceProto && sourceProto.includes("extension");
};

/**
 * @param {(r: Record<string, any>) => string} aggrFunction
 * @returns {(r: Record<string, any>) => string}
 */
const skipExtensions = (aggrFunction) => {
  return (r) => {
    if (isExtension(r)) {
      return "extension";
    }
    return aggrFunction(r);
  };
};

/**
 * @param {number} num
 * @returns {boolean}
 */
const isPowerOf10 = (num) => Math.log10(num) % 1 === 0;

/**
 * @param {Record<string, any>} r CSP report object
 * @returns {string}
 */
const defaultAggregation = (r) =>
  [
    `vd:${r["violated-directive"]};`,
    `bu:${r["blocked-uri"] || "-"};`,
    `sf:${r["source-file"] || "-"};`,
    `pos:${r["line-number"] || "-"}/${r["column-number"] || "-"};`,
    `du:${r["document-uri"]};`,
  ].join("");

/**
 * @type {Record<string, (arg:Record<string,any>)=>string>}
 */
const aggregations = {
  // verbosity: 5
  allUnique: (r) => JSON.stringify(r),
  // verbosity: very verbose and a bit heavy on memory
  uniqueNoExt: skipExtensions((r) => JSON.stringify(r)),
  // verbosity: default + details from browser extensions
  withExtensions: defaultAggregation,
  // verbosity: default + sepaarte entry for each different script loaded
  defaultPlusSample: skipExtensions(
    (r) => defaultAggregation(r) + `ss:${r["script-sample"]};`
  ),
  // verbosity: default - heuristic to aggregate same violations together
  default: skipExtensions(defaultAggregation),
  // verbosity: same as default, but shows less repetitions for script/style violations across many urls
  uniqueSample: skipExtensions((r) => {
    if (r["script-sample"].length > 0) {
      return [
        `vd:${r["violated-directive"]};`,
        `ss:${r["script-sample"]};`,
      ].join("");
    } else {
      return defaultAggregation(r);
    }
  }),
  // verbosity: lowest; sampling from each page
  sampleDirective: skipExtensions((r) =>
    [`vd:${r["violated-directive"]};`, `du:${r["document-uri"]};`].join("")
  ),
};

module.exports = {
  /**
   * @param {ReportAggregatorOptions} options
   */
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

    /**
     * @param {object} arg
     * @param {Record<string, any>} arg.report
     * @param {Record<string, any>} [arg.customFields]
     */
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
