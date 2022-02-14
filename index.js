const functions = require("./functions.js");
const SiwsMessage = require("./SiwsMessage.js");

module.exports = {
  ...functions,
  ...SiwsMessage,
};
