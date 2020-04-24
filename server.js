const http = require('http');

const cspHandler = require('./index');

http.createServer(cspHandler).listen(8000, console.log);