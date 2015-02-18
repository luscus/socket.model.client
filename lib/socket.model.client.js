/* jshint node:true */
'use strict';

var validation     = require('./validation');
var queue          = require('./tools/queue');
var cluster        = require('./tools/cluster');
var ErrorHandler   = require('./tools/ErrorHandler');
var onConnected    = require('./events/onConnected');
var onDisconnected = require('./events/onDisconnected');
var onHanging      = require('./events/onHanging');
var pless          = require('prototype-less');

exports.validate    = validation.validate;
exports.handleError = ErrorHandler.handle;
exports.queue       = queue.new;

exports.apply       = function applyServerTemplate (_socket) {

  _socket.connections = {};
  _socket.cluster     = [];
  _socket.queue       = [];

  _socket.on('connected',    onConnected.bind(_socket));
  _socket.on('disconnected', onDisconnected.bind(_socket));
  _socket.on('hanging',      onHanging.bind(_socket));

  _socket.connect     = cluster.connect;
  _socket.generateId  = cluster.generateId;

  // needed to catch ECONNRESET errors
  // TODO: check for cause -> netSocket are created on post? see array at connection.client.agent.sockets[netSocketName]
  process.on('uncaughtException', function uncaughtExceptionHandler (error) {
    ErrorHandler.handle.bind(_socket)(error);
  });

  // Applying the pattern specific beaviour template
  var patternTemplate = require('./templates/' + _socket.options.pattern);
  pless.mixin(_socket, patternTemplate);
};
