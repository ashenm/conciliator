/**
 * Custom Router
 * Custom Route Handler
 *
 * Ashen Gunaratne
 * mail@ashenm.ml
 *
 */

const fs = require('fs');

class Router {

  constructor(file) {

    Object.defineProperties(this, {
      file: {
        value: file
      },
      routes: {
        writable: true,
        value: Router.forge(file)
      }
    });

    // watch for changes on file
    // and update routes accordingly
    this.watch();

  }

  /**
   * Redirects an incoming HTTP request
   * to matching route or alternate otherwise
   */
  route(pathname, request, response, alternate) {
    const path = pathname.toLowerCase();
    response.writeHead(301, {'Location': this.routes.hasOwnProperty(path) ? this.routes[path] : alternate + request.url});
    response.end(null);
  }

  /**
   * Repopulate routes on file content change
   */
  watch() {
    fs.watch(this.file, (event, file) => {
      if (event === 'change')
        this.routes = Router.forge(this.file);
    })
  }

  /**
   * Returns a hash-map of routes
   * constructed from the parametrised file
   */
  static forge(file) {
    return fs.readFileSync(file, 'utf8').trim().split(/\r\n|\r|\n/)
      .reduce((accumulator, route, index, routes) => {

        // ignore comments
        if (!route.startsWith('#')) {
          const [path, location] = route.split(' ');
          accumulator[path] = location;
        }

        return accumulator;

      }, {});
  }

}

module.exports = Router;
