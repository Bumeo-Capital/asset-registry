# LSF wallet multichain catalog

The owner requested publication of the LSF Light wallet representations on
2026-09-25. The following exact locations are now default-visible under their
existing canonical asset IDs:

| Asset | Newly included location | Precision |
| --- | --- | --- |
| OSMO | Terra Classic IBC, transfer/channel-1/uosmo | 6 |
| INJ | Terra Classic IBC, transfer/channel-143/inj | 18 |
| LUNC | Osmosis IBC, transfer/channel-72/uluna | 6 |
| USTC | Osmosis IBC, transfer/channel-72/uusd | 6 |
| JURIS | Osmosis IBC, transfer/channel-78488/cw20:terra1vhgq25vwuhdhn9xjll0rhl2s67jzw78a4g2t78y5kz89q9lsdskq2pxcj2 | 6 |
| LUNC, USTC | Ethereum and BNB Smart Chain ERC20 contracts in representations.json | 6 |
| USDC | Existing Injective bank representation promoted from hidden to default | 6 |

Exact identifiers, provenance and endpoints are recorded in the registry JSON.
The resulting supported-wallet groups are LUNC (4 networks), USTC (4),
JURIS (2), OSMO (2), INJ (2), and USDC (2 networks, 3 representations).
Solana remains preparation-only and its bridge candidates remain in the review queue.
Noble USDC, Osmosis allBTC and Ethereum wSPYx collateral remain provenance-only hidden entries.

## Evidence

[Public observations](evidence/multichain-2026-09-25.json) record read-only latest-state
queries. IBC denomination hashes are SHA-256 of the exact trace paths above.
Osmosis returned the three destination traces. Terra returned OSMO's bank metadata;
Terra's INJ metadata lookup was unavailable, so INJ's identifier was independently
recomputed from its native denom and the verified reciprocal channel 143/497.
INJ precision comes from the existing reviewed native representation. Channel and
client records confirm Terra Classic/Osmosis identities and open reciprocal paths.
JURIS uses Terra's CW20 adapter port/channel-108, not the native transfer port.

All four EVM contracts return code, six decimals, and the expected token name and
symbol. Terra's Hyperlane routers explicitly enroll each EVM contract. EVM
`routers(132556)` returns the corresponding Terra router bytes. These checks
establish token identity and enrolled provenance; they do not test bridge execution,
relayer availability, solvency or current redeemability. Queries are not an atomic
cross-chain snapshot. The unavailable historical Hyperlane YAML URLs were not
used as verification evidence.

Prepared Injective USDC and wSPYx entries are included with their earlier public
evidence and owner decisions. The historical eight-token DEX snapshot is unchanged.
