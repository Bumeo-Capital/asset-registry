# Injective USDC

Injective USDC and Noble USDC use the same registry model: canonical asset `usdc`,
a source-chain representation, and a default IBC representation on Terra Classic.
As of 2026-09-25, Injective USDC is default-visible for multichain wallets; Noble stays hidden.
The two Terra denoms retain their separate identities and return routes.

| Field | Injective USDC |
| --- | --- |
| Source representation | `injective/erc20-usdc` |
| Injective bank denom | `erc20:0xa00C59fF5a080D2b954d0c75e46E22a0c371235a` |
| Underlying ERC-20 | `0xa00C59fF5a080D2b954d0c75e46E22a0c371235a` |
| Terra representation | `terra-classic/ibc-injective-usdc` |
| Terra denom | `ibc/F52112392095A6D6D1B17EF1FE19BE0B39B2A79B8A2B2F55CD721FC7DBF5081F` |
| Decimals | 6 |
| IBC channels | Injective `channel-497`, Terra Classic `channel-143` |

[Circle lists the underlying contract](https://developers.circle.com/stablecoins/usdc-contract-addresses).
The registry records the Cosmos bank-facing denomination as `cosmos-native`, matching
the bank/IBC interface used by the wallet. This describes its local interface;
it does not mean USDC is Injective's gas coin. The `erc20:` prefix is part of the
bank denomination, not part of an EVM contract address.

The [public query snapshot](evidence/injective-usdc-2026-09-22.json) records six decimals
from Injective bank metadata, both open channels, reciprocal connection IDs, and
clients identifying `injective-1` and `columbus-5`. Terra metadata confirms the trace
`transfer/channel-143/erc20:0xa00C59fF5a080D2b954d0c75e46E22a0c371235a`;
its SHA-256 matches the registered IBC denom. Queries used latest state rather than
one atomic snapshot. These checks verify identity and provenance, not transfer execution.

Neither new entry is added to the historical eight-token DEX snapshot. Product
trading and route execution remain outside this metadata registry.
