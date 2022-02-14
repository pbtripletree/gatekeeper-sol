const bs58 = require("bs58");
const nacl = require("tweetnacl");
const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");
const { clusterApiUrl, Connection } = require("@solana/web3.js");

const { Request, Response } = require("./models.js");

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
  return accounts.map((account) => account.account.data.parsed.info.mint);
};

const verifyRequest = (request) => {
  const messageBytes = new TextEncoder().encode(request.message);

  const publicKeyBytes = bs58.decode(request.publicKey);
  const signatureBytes = bs58.decode(request.signature);

  const result = nacl.sign.detached.verify(
    messageBytes,
    signatureBytes,
    publicKeyBytes
  );
  return result;
};

const authorizeSolana = async ({ request, tokenRoles }) => {
  const req = new Request(request);
  if (!verifyRequest(req))
    return new Response(false, ResponseMessage.INVALID_SIGNATURE, null);
  const tokens = await getOwnedTokens(req.publicKey);
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

module.exports = { authorizeSolana };
