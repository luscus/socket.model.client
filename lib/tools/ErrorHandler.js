/* jshint node:true */
'use strict';

exports.ECONNRESET = function ECONNRESET (connection) {
  console.warn('ECONNRESET: ', connection.host+':'+connection.port);

  if (connection.host) {
    connection.parent.emit('disconnected', connection);
  }
  else {
    // ignore Error Object
  }
};

exports.ECONNREFUSED = function ECONNREFUSED (connection) {
  console.warn('ECONNREFUSED: ', connection.host+':'+connection.port);
  connection.parent.emit('disconnected', connection);
};

exports.handle = function handleError (error) {
  var connection = this;
  
  //console.log('ErrorHandler.handle: ', error.code, error.stack);

  if (exports[error.code]) {
    exports[error.code](connection);
  }
  else {
    throw error;
  }
}
