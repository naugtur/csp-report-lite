# csp-report-lite

A lightweight sink (target) for Content Security Policy `report-uri` reporting that does initial filtering to hopefully report only as much as a human could reasonably read and not overwhelm the log/storage you plug it into.

Similar/repetetive reports are aggregated/sampled and reported only on power of 10 counts: 1st, 10th, 100th occurence and so on.

The tool is optimized to run a single in-memory instance and fail if overwhelmed. If you're getting more CSP reports than this can handle, your CSP is likely broken to an extent where local testing in the browser will surface enough information that you don't need to ship to users yet.

## Usage

### 1. docker image

The repository produces a docker image you can host directly with default configuration.

```
docker pull ghcr.io/naugtur/csp-report-lite/csp-report-lite:latest
```

### 2. server.js

You can download the repository and use the barebones http server in Node.js.
You can edit the config to adapt to your needs.

### 3. as a dependency

Install `csp-report-lite` as a dependency and use it in your own server - see server.js for examples.

## Target (log or database)

When you have access to options (2 and 3 above) you can pass a `target` option that is a function which will get called with every report that results from the aggregation/sampling.
The basic implementation in server.js logs the report, but you can also save it in a database and later query and search through the reports.

## Report aggregation level

Browser extensions can cause policy violations that tend to be useless and unique. Most aggregation options aggregate all reports from extensions into one key.

The following aggregation strategies are available, listed from most to least verbose:
| Strategy | Description | Verbosity |
|----------|-------------|-----------|
| `sampleDirective` | Lowest verbosity - samples violations from each page, grouping by directive and document URI only. Will skip a lot | lowest |
| `uniqueSample` | Similar to default, but reduces repetition for script/style violations across multiple URLs | default, deduplicated across pages |
| `default` | Default aggregation using a heuristic to group similar violations together | default |
| `withExtensions` | Default aggregation but not skipping reports from browser extensions | default |
| `defaultPlusSample` | Default aggregation plus separate entry for each different script loaded | medium |
| `uniqueNoExt` | Like allUnique, but groups browser extension reports together | verbose |
| `allUnique` | Every report is treated as unique | maximum |

You can configure the aggregation strategy using the `exponentialAggregation` option.

