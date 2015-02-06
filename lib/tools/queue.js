/* jshint node:true */
'use strict';

var merge  = require('node.extend');
var pless  = require('prototype-less');

exports.queueTemplate = {
  queued: [],

  pending: [],

  hasNext: function hasNext () {
    return this.queued.length > 0;
  },

  add: function add (packet) {
    this.queued.push(packet);
  },

  next: function next () {
    var packet = this.queued.shift();

    this.pending.push(packet);

    return packet;
  },

  remove: function remove (packet) {
    var index = this.pending.length;
    var pending;

    while (index--) {
      pending = this.pending[index];

      if (packet.header.id === pending.header.id) {
        this.pending.splice(index, 1);
        return;
      }
    }
  },

  flush: function flush (packet) {
    var all = this.queued.concat(this.pending);

    this.queued  = [];
    this.pending = [];

    return all;
  }
};

exports.new = function newQueue () {
  return pless.privateMixin({}, exports.queueTemplate);
};
