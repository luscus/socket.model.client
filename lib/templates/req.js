/* jshint node:true */
'use strict';

var cluster    = require('../tools/cluster');
var tools      = require('socket.lib.tools');

exports.lib = {};

exports.getClusterTarget = function getClusterTarget () {
  if (this.cluster.length) {
    return this.cluster[Math.floor(Math.random() * this.cluster.length)];
  }

  return false;
};

exports.send   = function send (data) {
  this.queue.push(data);

  var index = this.queue.length;

  while (index--) {
    var targetId = this.getClusterTarget();
    var target   = this.connections[targetId];

    if (target) {
      //this.updateStats(target, data);
      var packet = tools.packet.wrapData(data, target);

      // add packet to the target connection queue
      target.queue.add(packet);

      // remove it from the main socket queue
      this.queue.pop();

      target.parent.lib._send(target);
    }
  }
};

exports.lib._send = function _send () {
  throw new Error('You have to implement a protocol specific socket.lib._send method');
};
