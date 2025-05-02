# Design Club Readme

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```


You can regenerate the FARCASTER Account Association environment variables by running `npx create-onchain --manifest` in your project directory.

The environment variables enable the following features:

- Frame metadata - Sets up the Frame Embed that will be shown when you cast your frame
- Account association - Allows users to add your frame to their account, enables notifications
- Redis API keys - Enable Webhooks and background notifications for your application by storing users notification details

```bash
# Required for Frame metadata
NEXT_PUBLIC_URL=
NEXT_PUBLIC_VERSION=
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=
NEXT_PUBLIC_ICON_URL=
NEXT_PUBLIC_IMAGE_URL=
NEXT_PUBLIC_SPLASH_IMAGE_URL=
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=

# Required to allow users to add your frame
FARCASTER_HEADER=
FARCASTER_PAYLOAD=
FARCASTER_SIGNATURE=

# Required for webhooks and background notifications
REDIS_URL=
REDIS_TOKEN=
```

3. Start the development server:
```bash
npm run dev
```

## Running Foundry Scripts

RPCs for base sepolia are available here https://chainlist.org/chain/84532

Use the following commands to invoke your deployment and admin‐update scripts:

### Set Cost
```bash
forge script contracts/script/setCost.s.sol:SetCostScript \
  --rpc-url $RPC_URL \
  --broadcast
```

### Set Payment Token
```bash
forge script contracts/script/setPaymentToken.s.sol:SetPaymentTokenScript \
  --rpc-url $RPC_URL \
  --broadcast
```

### Transfer Admin
```bash
forge script contracts/script/transferAdmin.s.sol:TransferAdminScript \
  --rpc-url $RPC_URL \
  --broadcast
```

### Accept Admin
```bash
forge script contracts/script/acceptAdmin.s.sol:AcceptAdminScript \
  --rpc-url $RPC_URL \
  --broadcast
```

## Deployment Info

Current test contract deployed at `0xC3B87b7c143D196e0B3bB36Ce003d17611dEfE4a`

Current test currency is USDC (`0x036CbD53842c5426634e7929541eC2318f3dCF7e`)

Current test cost is `500000` or `$0.50`

#