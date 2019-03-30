'use strict';
const dotenv = require('dotenv');

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}
const Hapi = require('hapi');

const server = Hapi.server({
  port: process.env.PORT || 3000,
});

require('./app/models/db');

async function init() {
  await server.register(require('inert'));
  await server.register(require('vision'));
  await server.register(require('hapi-auth-cookie'));

  server.views({
    engines: {
      hbs: require('handlebars')
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layouts',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false
  });

  server.auth.strategy('standard', 'cookie', {
    password: process.env.cookie_password,
    cookie: process.env.cookie_name,
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000,
    redirectTo: '/'
  });

  server.auth.default({
    mode: 'required',
    strategy: 'standard'
  });

  server.route(require('./routes'));
  server.route(require('./routesapi'));
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
