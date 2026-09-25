# Bumeo asset metadata source of truth

This repository, Bumeo-Capital/asset-registry, is the canonical shared source of
reviewed network and asset identity, precision, presentation and provenance for
Bumeo packages and their consumer applications. It was transferred from
LUNCPumpfun/asset-registry at the owner's request.

Bumeo packages consume this registry centrally. Consumers must not maintain
parallel token lists. Synchronization resolves one commit before reading the
files so metadata from different revisions is never mixed. Automatic updates
must retain the source revision and validate exact chain/denom/contract identity.
Unknown or unavailable metadata is not evidence of zero balance or a price.

Registry data does not authorize transactions. A send review binds exact asset
identity and precision to its registry revision; later metadata updates cannot
change that reviewed operation. Live chain balances, fees, signing and submission
remain the responsibility of shared DApp adapters and the external wallet.

The existing DEX's pool/routing database remains unchanged by this transfer.
Registry curation and lifecycle/verification controls remain in force.
