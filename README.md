# component-issue-handler
At WeFlex, we want to handle issues in a way that our B2B clients or staff can categorize them.

We want to provide solutions to these issues and keep a record of them so we can create a solution database to these common issues.

## Description

The model here shows an ERD diagram.
![ERD for component-issue-handler](component-issue-handler.png?raw=true)

## Usage

- Add dependency to your loopback project's package.json

```
  "component-issue-handler": "^1.0.0",
```

- Add models to server/model-config.json

```
  "_meta": {
    "sources": [
      "../common/models",
      ...
      ...
      "../node_modules/component-issue-handler/common/models"
    ]
  },
  "Issue": {
    "dataSource": "rest",
    "public": true
  },
  "IssueCategory": {
    "dataSource": "rest",
    "public": true
  },
  "Solution": {
    "dataSource": "rest",
    "public": true
  },
```

- Add a boot script to server/boot/issue-hander.js

```
'use strict';

module.exports = function (app) {
  var issueHandler = require('component-issue-handler');

  var options = {
    // custom user model
    userModel: 'User', // specify your custom user model
    venueModel: 'Venue', // specify your custom venue model

    // used by modelBuilder, component-issue-handler/lib/models/index.js
    // Data source for metadata persistence
    dataSource: app.dataSources.db, // specify your datasource
  }
  issueHandler(app, options);
}
```
