/**
 * Conciliator
 * A Proxy Server
 *
 * Ashen Gunaratne
 * mail@ashenm.ml
 */

const cRouter = require('./cRouter');
const http = require('http');
const path = require('path');
const url = require('url');

const alternate = 'https://www.ashenm.ml';
const router = new cRouter(path.join(__dirname, '.data', 'routes.txt'));

// ignore following proxy headers
// when echoing request headers
const ignores = ['x-forwarded-host', 'x-glitch-routing', 'x-request-id', 'x-forwarded-for', 'x-forwarded-proto', 'x-forwarded-port', 'x-amzn-trace-id'];

http.createServer((request, response) => {

  const pURL = url.parse(request.url);

  // echo headers
  if (/^\/headers$/.test(pURL.pathname)) {

    const headers = Object.assign(request.headers);
    const sanitised = ignores.reduce((accumulator, header) => {
      delete accumulator[header];
      return accumulator;
    }, Object.assign(request.headers, {}));

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(sanitised));
    return;

  }

  // only allow GET requests
  // to subsequent routes
  if (!/^GET$/.test(request.method)) {
    response.writeHead(405, {'Content-Type': 'text/plain'});
    response.end(response.statusMessage);
    return;
  }

  // favicon
  if (/^\/favicon\.ico$/.test(pURL.pathname)) {
    response.writeHead(404);
    response.end(null);
    return;
  }

  // custom routes
  router.route(pURL.pathname, request, response, alternate);

}).listen(process.env.PORT || 8080);
