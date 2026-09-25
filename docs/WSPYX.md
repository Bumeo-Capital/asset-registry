# Wrapped SP500 xStock (wSPYx)

The owner requested the SP500 xStock representation deployed on Terra Classic.
Public chain queries on September 22, 2026 verified the identities below.
The source responses and Ethereum RPC call data are preserved in
[the evidence snapshot](evidence/wspyx-2026-09-22.json).

| Field | Value |
| --- | --- |
| Canonical asset | `wspyx` |
| Terra Classic name / symbol | Wrapped SP500 xStock / `wSPYx` |
| Terra Classic CW20 | `terra1wjyvzdrc7pmfemy3ycpnht83trxvccu4ecg7ek0hzf5nt49s8ssqmdldjl` |
| Ethereum collateral (wSPYx V2) | `0xe7e553cd128f0011777323a0b44a7b96ea1cb540` |
| Decimals | 18 on both chains |
| Terra Classic Warp / CW20 minter | `terra1457gshlrfmzrp69lh3v06qdp3rq8rk0vxfw2974g0ryw5sn4pa2s8tk0tq` |
| Ethereum router | `0x38bd8910dA4F55654173297b27F5D87294CFbD96` |
| Hyperlane domains | Ethereum `1`, Terra Classic `132556` |
| Visibility | Terra Classic `optional`; Ethereum `hidden` for provenance |

Terra's Warp reports bridged mode and the exact CW20 above. Its domain-1 route
matches the Ethereum router. Ethereum `token()` returns the collateral above;
`routers(132556)` returns the 32-byte payload of the Terra Warp address.
Ethereum `decimals()` and `symbol()` return 18 and `wSPYx`.
Ethereum calls in the snapshot are pinned to its recorded block; Terra LCD queries
were made against latest state and are not an atomic block snapshot.

The economic identity here is the wrapped collateral wSPYx, not unwrapped SPYx.
No representation of unwrapped SPYx is added or treated as interchangeable.
The owner selected the official SPYx product logo for this wrapped representation.
It was downloaded unchanged from the [issuer product page](https://assets.backed.fi/products/sp500-xstock)
on September 22, 2026: [original PNG](https://cdn.prod.website-files.com/655f3efc4be468487052e35a/6a9865b36967fd31d0415ecf_SPYx.png).
Local copy: `images/assets/wspyx.png`; SHA-256: `83c5db1a3c9d82482b9422bf1f850f1efe8af0ca9ed9455cb71f7830ad16b5c4`.
The shared logo is presentation only and does not merge wSPYx with unwrapped SPYx.

At observation, Terra CW20 `total_supply` was `0`. Deployment and reciprocal
enrollment do not demonstrate a completed transfer or roundtrip. Relayer coverage,
transfer fees, and successful transfer execution have not been verified here.
The active connection records deployed provenance; it does not enable a bridge
route or trading in any consuming product. The recorded eight-token DEX snapshot
remains unchanged.
