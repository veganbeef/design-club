import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { useMemo } from 'react'
import type { Account, Chain, Client, Transport } from 'viem'
import { type Config, useConnectorClient } from 'wagmi'

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  console.log('clientToSigner', client)
  console.log('account', account)
  console.log('chain', chain)
  console.log('transport', transport)
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  console.log('provider', provider)
  const signer = new JsonRpcSigner(provider, account.address)
  console.log('signer', signer)
  return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  console.log('client', client)
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}