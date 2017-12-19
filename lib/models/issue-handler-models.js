'use strict';

var issueDef = require('../../common/models/Model.Issue.json');
var issueCategoryDef = require('../../common/models/Model.IssueCategory.json');
var solutionDef = require('../../common/models/Model.Solution.json');

// Remove proerties that will confuse LB
function getSettings(def) {
  var settings = {};
  for (var s in def) {
    if (s === 'name' || s === 'properties') {
      continue;
    } else {
      settings[s] = def[s];
    }
  }
  return settings;
}

module.exports = function(dataSource) {
  // "Issue Category"
  var IssueCategory = dataSource.createModel(
    issueCategoryDef.name, issueCategoryDef.properties, getSettings(issueCategoryDef));

  // "Issue"
  var Issue = dataSource.createModel(
    issueDef.name, issueDef.properties, getSettings(issueDef));

  // "Solution"
  var Solution = dataSource.createModel(
    solutionDef.name, solutionDef.properties, getSettings(solutionDef));

  return {
    IssueCategory: IssueCategory,
    Issue: Issue,
    Solution: Solution,
  };
}
