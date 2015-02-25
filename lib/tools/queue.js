/* jshint node:true */
/* global require */
/* global exports */
'use strict';

var pless  = require('prototype-less');

exports.queueTemplate = {
  queued: [],

  pending: [],

  hasNext: function hasNext () {
    var result = this.queued.length > 0;

    return result;
  },

  add: function add (packet) {
    this.queued.push(packet);
    //console.log('  - added package with id: ', packet.id +'\n     => resulting queue: ', this.queued, this.pending);
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

      if (typeof pending === 'undefined') {
        this.pending.splice(index, 1);
      }
      else {
        if (packet.id === pending.id) {
          this.pending.splice(index, 1);
          //console.log('  - removed package with id: ', packet.id+'\n     => resulting queue: ', this.queued, this.pending);
        }
      }
    }
  },

  flush: function flush (packet) {
    var all = this.queued.concat(this.pending);

    this.queued  = [];
    this.pending = [];

    return all;
  },

  reset: function flush (packet) {
    this.queued = this.queued.concat(this.pending);
    return this.queued;
  }
};

exports.new = function newQueue () {
  return pless.privateMixin({}, exports.queueTemplate);
};
