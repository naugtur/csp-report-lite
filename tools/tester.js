const http = require("http");
const tester =
  ({ headers = [], port = 0 } = {}) =>
  (req, res) => {
    res.setHeader("content-type", "text/html");
    headers.forEach((header) => {
      res.setHeader(header[0], header[1]);
    });
    res.end(`<body>
<pre>${JSON.stringify(headers, null, 2)}</pre>
<script src="http://example.com/noscriptthere.js"></script>
<script>eval("1+1")
</script>
<script>window.location.hash=123456789012345678901234567890123456789012345678901234567890
</script>
<style>
    @font-face {
        font-family: myFirstFont;
        src: url(karramba.woff);
    }
</style>
<img src="http://example.com/nosuch.png">
  </body>`);
  };

let currentPort = 8000;

const reportHost = process.argv[2] || "http://localhost:8000/";

const spinUpServer = (headers) => {
  currentPort++;
  const port = currentPort;
  http
    .createServer(tester({ headers, port }))
    .listen(port, () => console.log(`test http://localhost:${port}/`));
};

spinUpServer([
  [
    "content-security-policy-report-only",
    `default-src 'none'; script-src 'none' 'report-sample'; report-uri ${reportHost}`,
  ],
]);

spinUpServer([
  [
    "report-to",
    JSON.stringify({
      group: "csp-endpoint1",
      max_age: 10886400,
      endpoints: [{ url: reportHost }],
    }),
  ],
  [
    "content-security-policy-report-only",
    "default-src 'none'; script-src 'none' 'report-sample'; report-to csp-endpoint1",
  ],
]);

spinUpServer([
  ["Reporting-Endpoints", `csp-endpoint1="${reportHost}"`],
  [
    "content-security-policy-report-only",
    "default-src 'none'; script-src 'none' 'report-sample'; report-to csp-endpoint1",
  ],
]);
