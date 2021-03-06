const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { clusterApiUrl, Connection } = require("@solana/web3.js");

const { Response } = require("./models.js");

const { SiwsMessage } = require("siws");

const { ResponseMessage } = require("./enums.js");

const getOwnedTokens = async (publicKey) => {
  const MY_WALLET_ADDRESS = publicKey;
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const accounts = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
    filters: [
      {
        dataSize: 165,
      },
      {
        memcmp: {
          offset: 32,
          bytes: MY_WALLET_ADDRESS,
        },
      },
    ],
  });

  return accounts
    .filter(
      (account) => account.account.data.parsed.info.tokenAmount.amount > 0
    )
    .map((account) => account.account.data.parsed.info.mint);
};

const decode = (token) => {
  let tokenObject = Buffer.from(token, "base64");
  const message = JSON.parse(tokenObject.toString("utf8"));
  return new SiwsMessage(message);
};

const authorize = async ({ request, tokenRoles }) => {
  const req = new SiwsMessage(request);
  if (!req.validate())
    return new Response(false, ResponseMessage.INVALID_SIGNATURE, null);
  const tokens = await getOwnedTokens(req.address);
  const roles = tokenRoles.filter((tokenRole) =>
    tokenRole.addresses.find((address) => tokens.includes(address))
  );
  if (!roles.length) return new Response(false, ResponseMessage.NO_ROLES);
  return new Response(
    true,
    ResponseMessage.ROLES,
    roles.map((role) => role.role)
  );
};

module.exports = { authorize, decode };
