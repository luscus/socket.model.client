/* jshint node:true */
'use strict';

var cluster        = require('../tools/cluster');

module.exports = function onDisconnected (connection) {
  cluster.updateCluster(connection, false);
};
