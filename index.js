'use strict';

const Hapi = require('hapi');

const server = Hapi.server({
  port: 3000,
  host: 'localhost'
});

async function init() {
  await server.register(require('inert'));
  await server.register(require('vision'));
  await server.register(require('hapi-auth-cookie'));

  server.views({
    engines: {
      hbs: require('handlebars'),
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layouts',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false,
  });

  server.auth.strategy('standard', 'cookie', {
    password: 'secretpasswordnotrevealedtoanyone',
    cookie: 'donation-cookie',
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000,
  });

  server.auth.default({
    mode: 'required',
    strategy: 'standard',
  });

  server.route(require('./routes'));
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

server.bind({
  users: {},
  donations: [],
  currentUser: {}
});

init();