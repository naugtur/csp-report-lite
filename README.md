# csp-report-lite

A lightweight sink (target) for Content Security Policy `report-uri` reporting that does initial filtering to hopefully report only as much as a human could reasonably read.

Surface:

1. WIP: a docker container with an entire server accepting input and logging json to stdout, errors to stderr
2. a request handler for a node server
3. a report aggregator function for doing the logic

More docs coming soon. For now check jsdoc in index.js