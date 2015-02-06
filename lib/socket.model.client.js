/* jshint node:true */
'use strict';

var merge          = require('node.extend');
var validation     = require('./validation');
var queue          = require('./tools/queue');
var cluster        = require('./tools/cluster');
var ErrorHandler   = require('./tools/ErrorHandler');
var onConnected    = require('./events/onConnected');
var onDisconnected = require('./events/onDisconnected');
var onHanging      = require('./events/onHanging');

exports.validate    = validation.validate;
exports.handleError = ErrorHandler.handle;
exports.queue       = queue.new;

exports.apply       = function applyServerTemplate (_socket) {

  _socket.connections = {};
  _socket.cluster     = [];

  _socket.on('connected',    onConnected.bind(_socket));
  _socket.on('disconnected', onDisconnected.bind(_socket));
  _socket.on('hanging',      onHanging.bind(_socket));

  _socket._connect = cluster._connect;
};
