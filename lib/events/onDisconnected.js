/* jshint node:true */
'use strict';

var cluster    = require('../tools/cluster');

module.exports = function onDisconnected (connection) {
  cluster.updateCluster(connection, false);

  var pendingPackets = connection.queue.flush();

  pendingPackets.forEach(function packetIterator (packet) {
    if (packet) { // TODO: find out why some packets are undefined
      connection.parent.send(packet.data);
    }
  });
};
