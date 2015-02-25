/* jshint node:true */
/* global require */
/* global exports */
'use strict';

exports.processQueue = function processQueue (_connection) {
  var socket = _connection.parent;
  var packet = _connection.queue.next();

  if (packet) {
    packet.requestReady();

    socket.lib._send(packet, _connection);

    if (_connection.queue.hasNext() && !_connection.queue.timer) {
      _connection.queue.timer = setTimeout(function () {
        processQueue(_connection);
      }, 15);
    }
    else {
      _connection.queue.timer = false;
    }
  }
};
