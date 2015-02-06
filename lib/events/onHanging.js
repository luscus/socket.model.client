/* jshint node:true */
'use strict';

module.exports = function onHanging (connection) {
  console.log('onHanging: ', connection.uri, connection.parent.config);
};
