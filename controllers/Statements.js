'use strict';

var utils = require('../utils/writer.js');
var Statements = require('../service/StatementsService');

module.exports.requestDialog = function requestDialog (req, res, next) {
  var statementId = req.swagger.params['statementId'].value;
  var invitation = req.swagger.params['invitation'].value;
  var senderID = req.swagger.params['senderID'].value;
  Statements.requestDialog(statementId,invitation,senderID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.setRequestStatus = function setRequestStatus (req, res, next) {
  var statementId = req.swagger.params['statementId'].value;
  var requestId = req.swagger.params['requestId'].value;
  var reason = req.swagger.params['reason'].value;
  var starterID = req.swagger.params['starterID'].value;
  var recipientID = req.swagger.params['recipientID'].value;
  Statements.setRequestStatus(statementId,requestId,reason,starterID,recipientID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};