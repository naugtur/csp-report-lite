function tester(req, res) {
  res.setHeader("content-type", "text/html");
  res.setHeader(
    "content-security-policy-report-only",
    "default-src 'none'; report-uri http://localhost:8000/"
  );
  res.end(`
<script src="http://example.com/noscriptthere.js"></script>
<script>
    eval("1+1")
</script>
<style>
    @font-face {
        font-family: myFirstFont;
        src: url(karramba.woff);
    }
</style>
<img src="http://example.com/nosuch.png">
  `);
}

const http = require("http");

http
  .createServer(tester)
  .listen(8001, () => console.log("test: http://localhost:8001/"));

