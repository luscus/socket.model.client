/* jshint node:true */
'use strict';

var cluster        = require('../tools/cluster');

module.exports = function onConnected (connection) {
  cluster.updateCluster(connection, true);
};
