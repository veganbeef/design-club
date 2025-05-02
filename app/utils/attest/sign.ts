import { EAS, NO_EXPIRATION, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { Signer } from 'ethers';

const EAS_CONTRACT_ADDRESS = process.env.REACT_APP_EAS_CONTRACT_ADDRESS || '0x4200000000000000000000000000000000000021';
const VOTE_SCHEMA_UID = process.env.REACT_APP_VOTE_SCHEMA_UID || '0x424041413f6893c2f2e3e0e91ce9e26763840795b9c7fbb3866502e8d5c94677';
const RECIPIENT = process.env.REACT_APP_RECIPIENT || '0x7fafaA5CDBB1c238D9DEc26320131ea76f49cc80';
/**
 * Generates an offchain EAS attestation for a vote.
 *
 * @param signer   ethers Signer connected to user’s wallet
 * @param params   object containing eventId, voteIndex, and recipient address
 * @returns        signed offchain attestation object
 */
export async function generateVoteAttestation(
  signer: Signer,
  { eventId, voteIndex, recipient = RECIPIENT }: { eventId: number; voteIndex: number; recipient?: string }
) {
  // 1. Init & connect
  const eas = new EAS(EAS_CONTRACT_ADDRESS);
  await eas.connect(signer);
  const offchain = await eas.getOffchain();
  console.log('EAS connected:', eas);
  console.log('Offchain:', offchain);
  // 2. Encode data
  const schemaEncoder = new SchemaEncoder('uint256 eventId, uint8 voteIndex');
  const encodedData = schemaEncoder.encodeData([
    { name: 'eventId',  value: eventId,  type: 'uint256' },
    { name: 'voteIndex', value: voteIndex, type: 'uint8'   }
  ]);
  console.log('Encoded data:', encodedData);
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
  console.log('Attestation:', att);

  return att;
}
