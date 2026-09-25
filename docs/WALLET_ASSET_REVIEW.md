# Wallet asset review queue

The five-network IBC and EVM candidates were approved and included on 2026-09-25.
See [the active multichain catalog](MULTICHAIN.md) for identities and verification.
Only the Solana bridge mints below remain candidates, pending their own identity checks.

## Hyperlane candidates

The pushed wallet code pins Hyperlane registry commit
`8a6ca318dbdb08dbdd8d0a68cd487bc592805d3a`. The route contracts below are evidence for review,
not permission to execute them from this registry.

| Canonical asset | Destination | Known local identity | Route |
| --- | --- | --- | --- |
| LUNC | Solana | mint `8dxTo5reLtvRDx3Q8WEP33Uj2C5u6372EygJdNbsLFKG` | `LUNC/terraclassic-bsc-ethereum-solanamainnet` |
| USTC | Solana | mint `GNUbsF5mrurtDzNc65HipN5Fyzzzqbj5UonLNhj9frjF` | `USTC/terraclassic-bsc-ethereum-solanamainnet` |
| JURIS | Solana | mint `HmKUJLZGTyFbEUX5sDisr8PERHjJRyoAkgZwc2YsbeRr` | `JURIS/solanamainnet-terraclassic` |

Solana identities and precision must be verified before activation. EVM entries are now verified
independently and recorded in the active catalog.

## LUNCDash legacy migration

No historical LUNCDash token has been imported by this initial release. A future migration review
should start from balances or concrete compatibility requirements, not from the full pre-crash
list. Any retained legacy-only entry must be `deprecated` and `hidden` unless separately promoted
by an explicit decision.
