/* jshint node:true */
/* global require */
/* global exports */
'use strict';

var Packet  = require('socket.packet.base');

exports.handler = function handler (data, connection) {
  var socket = connection.parent;

  if (data.CONNTEST) {
    //console.log('test successful: ', packet.CONNTEST);
    return;
  }

  var packet = Packet.instantiate(data, socket.options.format);
  packet.responseReceived();

  socket.emit('message', packet, connection.uri);

  connection.queue.remove(packet);
};
