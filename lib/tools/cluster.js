/* jshint node:true */
'use strict';

var merge      = require('node.extend');
var Util       = require('util');
var queue      = require('./queue');
var tools      = require('socket.lib.tools');


exports.MAX_INTERVAL = 1800000;

exports.initConnection = function (targetConfig, socket, usePath) {
  var connection      = {};

  connection.host     = targetConfig.host;
  connection.port     = targetConfig.port;
  connection.uri      = tools.net.getUri(targetConfig);
  connection.parent   = socket;
  connection.queue    = queue.new();

  if (usePath) {
    connection.uri    +=
      tools.uri.getPathString(
        targetConfig.port,
        socket.config.secret
      ) +
      '/';
  }

  return connection;
};

exports.getConnections = function getConnections (targetSocket, socket, usePath) {
  var targetConfig = merge(true, {}, targetSocket);
  var connections  = [];

  if (!Util.isArray(targetSocket.host)) {
    targetSocket.host = [targetSocket.host];
  }

  if (!Util.isArray(targetSocket.port)) {
    targetSocket.port = [targetSocket.port];
  }

  targetSocket.host.forEach(function hostIterator (host) {
    targetSocket.port.forEach(function portIterator (port) {
      targetConfig.host = host.toLowerCase();
      targetConfig.port = port;

      var connection = exports.initConnection(targetConfig, socket, usePath);

      connections.push(connection);
    });
  });

  return connections;
};

exports.connect = function connect (targetSocket) {
  var socket = this;

  if (typeof targetSocket === 'string') {
    // handle provided uri string
    var parsed = tools.uri.parse(targetSocket);

    targetSocket = {};
    targetSocket.protocol = parsed.protocol;
    targetSocket.host     = parsed.host.toLowerCase();
    targetSocket.port     = parsed.port;
    targetSocket.path     = parsed.path;
  }

  if (!targetSocket.protocol) {
    targetSocket.protocol = socket.config.protocol;
  }

  if (!targetSocket.host) {
    targetSocket.host      = [socket.config.host];
  }

  var connections = exports.getConnections(targetSocket, socket, socket._usePath);

  this._connect(connections);
};

exports.reconnect = function reconnect (connection) {
  setTimeout(connection.test, connection.nextReconnectOffset);

  connection.nextReconnectOffset *= 2;

  if (exports.MAX_INTERVAL < connection.nextReconnectOffset) {
    // greatest interval is 30 minutes
    connection.nextReconnectOffset = exports.MAX_INTERVAL;
  }
};

exports.updateCluster = function updateCluster (connection, status) {
  status = (typeof status === 'boolean' ? status : false);

  var uri        = connection.uri;
  var socket     = connection.parent;

  var index      = socket.cluster.indexOf(uri);
  var hasChanged = false;

  if (status && index < 0) {
    // add host to pool
    socket.cluster.push(uri);
    socket.connections[uri].connected = true;

    delete socket.connections[uri].nextReconnect;
    delete socket.connections[uri].nextReconnectOffset;

    hasChanged = true;
    console.log('updateCluster: ', connection.host+':'+connection.port, 'added');
  }
  else if (!status) {
    socket.connections[uri].connected = false;

    if (!socket.connections[uri].nextReconnectOffset) {
      socket.connections[uri].nextReconnectOffset = 2000;
    }

    if (index > -1) {
      // remove host from pool
      socket.cluster.splice(index, 1);
      hasChanged = true;
      console.log('updateCluster: ', connection.host+':'+connection.port, 'removed');
    }

    exports.reconnect(socket.connections[uri]);
  }

  if (hasChanged) {
    socket.emit('clusterUpdate', uri, status, socket.cluster);
  }
};
