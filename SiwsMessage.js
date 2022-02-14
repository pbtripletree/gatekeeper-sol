const crypto = require("crypto");

class SiwsMessage {
  constructor({ domain, address, statement }) {
    this.domain = domain;
    this.address = address;
    this.statement = statement;
  }

  prepareMessage() {
    const nonce = crypto.randomBytes(16).toString("base64");
    const timestamp = new Date();
    const message = `${this.domain} wants you to sign in with your Solana account:\n${this.address}\n\n${this.statement}.\n\nNonce: ${nonce}\nIssued At: ${timestamp}`;
    console.log(message);
    return new TextEncoder().encode(message);
  }
}

module.exports = {
  SiwsMessage,
};
