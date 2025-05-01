import { EAS, NO_EXPIRATION, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { Signer } from 'ethers';

const EAS_CONTRACT_ADDRESS = process.env.REACT_APP_EAS_CONTRACT_ADDRESS || '<YOUR_EAS_CONTRACT_ADDRESS>';
const VOTE_SCHEMA_UID = process.env.REACT_APP_VOTE_SCHEMA_UID || '<YOUR_VOTE_SCHEMA_UID>';

/**
 * Generates an offchain EAS attestation for a vote.
 *
 * @param signer   ethers Signer connected to user’s wallet
 * @param params   object containing eventId, voteIndex, and recipient address
 * @returns        signed offchain attestation object
 */
export async function generateVoteAttestation(
  signer: Signer,
  params: { eventId: number; voteIndex: number; recipient: string }
) {
  const { eventId, voteIndex, recipient } = params;

  // 1. Init & connect
  const eas = new EAS(EAS_CONTRACT_ADDRESS);
  await eas.connect(signer);
  const offchain = await eas.getOffchain();

  // 2. Encode data
  const schemaEncoder = new SchemaEncoder('uint256 eventId, uint8 voteIndex');
  const encodedData = schemaEncoder.encodeData([
    { name: 'eventId',  value: eventId,  type: 'uint256' },
    { name: 'voteIndex', value: voteIndex, type: 'uint8'   }
  ]);

  // 3. Sign offchain attestation
  const att = await offchain.signOffchainAttestation(
    {
      recipient,
      expirationTime: NO_EXPIRATION,
      time: BigInt(Math.floor(Date.now() / 1000)),
      revocable: true,
      schema: VOTE_SCHEMA_UID,
      refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
      data: encodedData
    },
    signer
  );

  return att;
}
