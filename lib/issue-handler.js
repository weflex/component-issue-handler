'use strict';
/**
 * Module dependencies
 */
 var SG = require('strong-globalize');
 var g = SG();
 var modelBuilder = require('./models/index');

 module.exports = function (app, options) {
   options = options || {};
   var models = modelBuilder(app, options);
   return models;
 }
