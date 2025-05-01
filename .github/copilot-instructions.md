Please take the following product brief and user stories into account when answering questions of generating code. This is the overarching user stories and product brief for the repository.

Product Brief:
A simple Farcaster mini-app built using Coinbase MiniKit and Ethereum’s EAS offchain attestations. Users provide a shipping address, deposit funds in the DesignClub contract, and then vote on a design through EAS-based attestations. The goal is a seamless, user-friendly flow for capturing shipping details, handling payments, and recording design preferences without needing on-chain overhead for every vote.

User Stories:

Address Entry: The user signs in and provides a physical shipping address as part of their profile details.
Funds Deposit: The user makes a payment via the DesignClub contract, which records successful deposits.
Design Voting: The user casts a vote through offchain EAS attestations, ensuring the vote is securely logged without extra gas costs.
This summary can serve as a quick reference for further development and prompts.