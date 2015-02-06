/* jshint node:true */
/* jshint expr:true*/
/* global describe */
/* global it */
'use strict';

require('chai').should();

var url = require('../lib/socket.model.client.js');


describe('Url Library Methods:', function () {

  describe('getPathString:', function () {

    it('exists', function () {
      url.should.have.property('getPathString');
      url.getPathString.should.be.a('function');
    });

    it('path without secret', function () {
      url.getPathString('localhost', 666)
        .should.equal('a9bcaab4e67a740efd0100391d0a2ddda1d5bb2e');
    });

    it('path with secret', function () {
      url.getPathString('localhost', 666, 'mySecret')
        .should.equal('8fb6755c6118267be94b01dca509cd49d4f561e9');
    });
  });
});
