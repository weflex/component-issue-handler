'use strict';
var debug = require('debug')('loopback:models');

module.exports = function(app, options) {
  var loopback = app.loopback;
  options = options || {};

  var dataSource = options.dataSource;
  if (typeof dataSource === 'string') {
    datasource = app.dataSource[dataSource];
  }
  var issueHandlerModels = require('./issue-handler-models')(dataSource);

  var userModel = loopback.findModel(options.userModel) ||
      loopback.getModelByType(loopback.User);
  debug('User model: %s', userModel.modelName);

  var venueModel = loopback.findModel(options.venueModel);
  debug('Venue model: %s', venueModel.modelName);

  var issueModel = issueHandlerModels.Issue;
  var issueCategoryModel = issueHandlerModels.IssueCategory;
  var solutionModel = issueHandlerModels.Solution;

  issueModel.belongsTo(userModel, { as: 'user', foreignKey: 'reportedBy'});
  issueModel.belongsTo(venueModel, { as: 'venue', foreignKey: 'venueId'});
  solutionModel.belongsTo(userModel, { as: 'user', foreignKey: 'solutionBy'});
  solutionModel.belongsTo(venueModel, { as: 'venue', foreignKey: 'venueId'});

  var users = {};
  users.find = function(id, done) {
    debug('users.find(' + id + ')');
    userModel.findOne({
      where: {
        id: id,
      }
    }, done);
  };

  users.findByUsername = function(username, done) {
    debug('users.findByUsername(' + username + ')');
    userModel.findOne({
      where: {
        username: username,
      }
    }, done);
  };

  users.findByUsernameOrEmail = function(usernameOrEmail, done) {
    debug('users.findByUsernameOrEmail(' + usernameOrEmail + ')');
    userModel.findOne({
      where: {
        or: [
          { username: usernameOrEmail },
          { email: usernameOrEmail },
        ],
      }
    }, done);
  };

  users.save = function(id, username, password, done) {
    debug('users.save(' + username + ')');
    userModel.create({
      id: id,
      username: username,
      password: password,
    }, done);
  };

  var issueCategory = {};
  issueCategory.delete = function(id, done) {
    issueCategoryModel.destroyById(id, done);
  };

  var issue = {};
  issue.findByCategory = function(category, done) {
    issueModel.findOne({
      where: {
        categoryId: category,
      }
    }, done);
  };
  issue.hide = function(id, done) {
    issueModel.findOne({
      where: {
        id: id,
      }
    }).then(function(issueToHide) {
      issueToHide.isHidden = true;
      issueToHide.save();
    }, done);
  };
  issue.unhide = function(id, done) {
    issueModel.findOne({
      where: {
        id: id,
      }
    }).then(function(issueToUnhide) {
      issueToUnhide.isHidden = false;
      issueToUnhide.save();
    }, done);
  };
  issue.markDuplicate = function(id, done) {
    issueModel.findOne({
      where: {
        id: id,
      }
    }).then(function(issueToMarkDuplicate) {
      issueToMarkDuplicate.isDuplicate = true;
      issueToMarkDuplicate.save();
    }, done);
  };
  issue.markUnique = function(id, done) {
    issueModel.findOne({
      where: {
        id: id,
      }
    }).then(function(issueToMarkUnique) {
      issueToMarkUnique.isDuplicate = false;
      issueToMarkUnique.save();
    }, done);
  };

  var solution = {};
  solution.findSolutionToIssue = function(issue, done) {
    solutionModel.findOne({
      where: {
        issueId: issue,
        isHidden: false,
      }
    }, done);
  };
  solution.hide = function(id, done) {
    solutionModel.findOne({
      where: {
        id: id,
      }
    }).then(function(solutionToHide) {
      solutionToHide.isHidden = true;
      solutionToHide.save();
    }, done);
  };
  solution.unhide = function(id, done) {
    solutionModel.findOne({
      where: {
        id: id,
      }
    }).then(function(solutionToUnhide) {
      solutionToUnhide.isHidden = false;
      solutionToUnhide.save();
    }, done);
  };

  var customModels = options.models || {};
  var models = {
    user: customModels.users || users,
    issue: customModels.issue || issue,
    issueCategory: customModels.issueCategory || issueCategory,
    solution: customModels.solution || solution,
  };
  return models;
}
