# Wallet asset review queue

These assets were found in the pushed LSF wallet code but are **not** active registry entries.
They require an explicit product-owner decision per representation. Native gas assets and the
provenance-only representations needed by the DEX snapshot are already in the initial catalog.

Approval must apply to an exact row, not only to its symbol. A representation can be accepted as
`default`, `optional`, or `hidden`, or rejected. Rejected rows stay out of the registry.

## IBC candidates

| Canonical asset | Destination chain | Exact local identifier | Origin | Transport | Suggested visibility |
| --- | --- | --- | --- | --- | --- |
| OSMO | Terra Classic | `ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B` | Osmosis `uosmo` | IBC | optional |
| INJ | Terra Classic | `ibc/D8402D9479F739A4C87BDC043AF920B82358EBE1D1B724233DB46E18D8D13921` | Injective `inj` | IBC | optional |
| USDC | Terra Classic | `ibc/F52112392095A6D6D1B17EF1FE19BE0B39B2A79B8A2B2F55CD721FC7DBF5081F` | Injective `erc20:0xa00C59fF5a080D2b954d0c75e46E22a0c371235a` | IBC | optional |
| LUNC | Osmosis | `ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0` | Terra Classic `uluna` | IBC | optional |
| USTC | Osmosis | `ibc/BE1BB42D4BE3C30D50B68D7C41DB4DFCE9678E8EF8C539F6E6A9345048894FCC` | Terra Classic `uusd` | IBC | optional |
| JURIS | Osmosis | `ibc/46579C587A0B8CF8B0A1FF6B0EFA2082F11876578E47FC81A9CAAD31F424AF98` | Terra Classic JURIS CW20 | IBC | optional |
| USDC | Injective | `erc20:0xa00C59fF5a080D2b954d0c75e46E22a0c371235a` | Injective | native representation used by current wallet code | none yet |

Before approval, each IBC row still needs an on-chain channel/client check equivalent to the two
connections already in `registry/connections.json`.

## Hyperlane candidates

The pushed wallet code pins Hyperlane registry commit
`8a6ca318dbdb08dbdd8d0a68cd487bc592805d3a`. The route contracts below are evidence for review,
not permission to execute them from this registry.

| Canonical asset | Destination | Known local identity | Route |
| --- | --- | --- | --- |
| LUNC | Ethereum | router `0xA4bc47a4C5461eB0E59A585a21A1222EF7544Ac6` | `LUNC/terraclassic-bsc-ethereum-solanamainnet` |
| LUNC | BNB Smart Chain | router `0x481095ecEd7A907e7f390b6226F53a66D379e6e2` | `LUNC/terraclassic-bsc-ethereum-solanamainnet` |
| LUNC | Solana | mint `8dxTo5reLtvRDx3Q8WEP33Uj2C5u6372EygJdNbsLFKG` | `LUNC/terraclassic-bsc-ethereum-solanamainnet` |
| USTC | Ethereum | router `0xf49408beb319aeCe3E8B3550a5C750C19b3F1e51` | `USTC/terraclassic-bsc-ethereum-solanamainnet` |
| USTC | BNB Smart Chain | router `0xfC067fd98FD123fC2cAd72d040AF60a523274339` | `USTC/terraclassic-bsc-ethereum-solanamainnet` |
| USTC | Solana | mint `GNUbsF5mrurtDzNc65HipN5Fyzzzqbj5UonLNhj9frjF` | `USTC/terraclassic-bsc-ethereum-solanamainnet` |
| JURIS | Solana | mint `HmKUJLZGTyFbEUX5sDisr8PERHjJRyoAkgZwc2YsbeRr` | `JURIS/solanamainnet-terraclassic` |

For EVM rows, the local ERC-20 identity must be verified independently; a router address is not
automatically treated as the token contract. Approved rows will receive exact representation and
connection records in a later change.

## LUNCDash legacy migration

No historical LUNCDash token has been imported by this initial release. A future migration review
should start from balances or concrete compatibility requirements, not from the full pre-crash
list. Any retained legacy-only entry must be `deprecated` and `hidden` unless separately promoted
by an explicit decision.
