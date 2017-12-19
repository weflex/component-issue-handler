'use strict';
/**
 * Module dependencies.
 */
var path = require('path');
var SG = require('strong-globalize');
SG.SetRootDir(path.join(__dirname, '..'));
var g = SG();
var issueHandler = require('./issue-handler');
var exports = module.exports = issueHandler;
