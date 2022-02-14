const crypto = require("crypto");

class Response {
  constructor(success, message, roles = null) {
    this.success = success;
    this.message = message;
    this.roles = roles;
  }
}

module.exports = { Response };
