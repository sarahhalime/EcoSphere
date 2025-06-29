#!/usr/bin/env node

/**
 * Module dependencies.
 */

var db=require('./config/mongoose')
var debug = require('debug')('backend:server');
var http = require('http');

const express = require('express');
const app = express();

const fetch = require('node-fetch'); // if you don't have it, install with npm install node-fetch

const speciesCategories = [
  { name: 'Birds', taxonKey: 212 },
  { name: 'Mammals', taxonKey: 359 },
  { name: 'Reptiles', taxonKey: 358 },
  { name: 'Amphibians', taxonKey: 131 },
  { name: 'Fish', taxonKey: 777 },
  { name: 'Insects', taxonKey: 216 },
];

app.get('/api/gbif-counts', async (req, res) => {
  try {
    const results = [];
    for (const category of speciesCategories) {
      const response = await fetch(
        `https://api.gbif.org/v1/species/count?rank=SPECIES&classKey=${category.taxonKey}`
      );
      const data = await response.json();
      results.push({ category: category.name, count: data.count });
    }
    res.json(results);
  } catch (error) {
    console.error('GBIF counts error:', error);
    res.status(500).json({ error: 'Failed to fetch GBIF counts' });
  }
});

app.get('/api/conservation-status', async (req, res) => {
  try {
    const response = await fetch(
      'https://api.inaturalist.org/v1/taxa?rank=species&per_page=100&taxon_id=3'
    );
    const data = await response.json();

    const statusCounts = {};
    for (const taxon of data.results) {
      const status = taxon.conservation_status?.status_name || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    }
    res.json(statusCounts);
  } catch (error) {
    console.error('Conservation status error:', error);
    res.status(500).json({ error: 'Failed to fetch conservation status' });
  }
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

db();
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('=== The app is runing on http://localhost:'+port)
}

module.exports = app;