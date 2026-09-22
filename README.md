# LSF Asset Registry

Public chain and asset metadata shared by LSF products.

The registry separates four concepts that must not be collapsed:

1. **Canonical assets** describe the economic asset people recognize, such as USDC.
2. **Representations** describe an exact denom, contract, or mint on one chain.
3. **Connections** describe how a representation originated or can move between chains.
4. **Product policy** decides what a product displays or executes. It remains outside this repo.

Grouping two representations under one canonical asset is a display relationship. It does not make
them interchangeable and does not authorize a swap, send, bridge, or signature.

## Layout

```text
registry/
  manifest.json          source snapshots and registry files
  chains.json            chain identities and native representations
  canonical-assets.json  chain-independent asset identities
  representations.json   exact chain-local asset identities
  connections.json       IBC and, after approval, other bridge provenance
schemas/                  JSON Schemas for the source files
images/                   reviewed local logos
scripts/validate.mjs      dependency-free integrity checks
docs/WALLET_ASSET_REVIEW.md
                          wallet candidates that are not registry entries yet
```

## Authority boundaries

- The LSF backend remains authoritative for tradable DEX tokens, pools, decimals used for
  execution, and routing.
- This repo is authoritative only for reviewed public identity, presentation, provenance, and
  curation metadata.
- Wallet and frontend code remain authoritative for transaction construction, signing, endpoint
  selection, fee policy, and route execution.
- Consumers must pin a release tag or commit. They must not execute transactions from mutable
  `main` data.

## Curation model

Each representation has independent fields:

- `verification`: whether its exact chain-local identity has been reviewed.
- `lifecycle`: whether the representation is active or deprecated.
- `visibility`: `required`, `default`, `optional`, or `hidden`.
- `sourceIds`: the evidence sets listed in `manifest.json`.

An exact identifier is always required. Symbol matching is never identity verification.

Legacy LUNCDash lists are not a default source. LUNC and USTC are included explicitly; any other
legacy-only asset requires an individual review and, if retained solely for migration, must be
`deprecated` and `hidden`.

## Initial scope

The first catalog contains:

- all eight tokens returned by the LSF DEX registry API at the recorded snapshot;
- LUNC and USTC;
- native gas assets for the currently supported wallet chains;
- provenance-only Noble USDC and Osmosis allBTC representations required to explain the two DEX
  IBC assets.

The discovered wallet-only IBC and Hyperlane assets are listed for product-owner approval in
[`docs/WALLET_ASSET_REVIEW.md`](docs/WALLET_ASSET_REVIEW.md). They are deliberately not active
registry entries.

## Validation

No package installation or build is required.

```bash
node scripts/validate.mjs
node --test scripts/validate.test.mjs
```

Validation checks unique IDs, references, canonical grouping, source evidence, bridge mappings,
logos, required chain-native representations, and complete coverage of the recorded DEX snapshot.

## Adding data

A pull request should include:

1. the exact chain-local identifier;
2. decimals from an authoritative source;
3. the canonical asset relationship;
4. origin and bridge provenance for non-native representations;
5. lifecycle, visibility, and verification decisions;
6. a stable logo or a deliberate omission.

Do not copy a historical token list wholesale. Unknown or user-added assets remain local wallet
data until explicitly reviewed.
