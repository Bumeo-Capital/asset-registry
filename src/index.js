import assetGroupsFile from "../registry/asset-groups.json" with { type: "json" };
import canonicalAssetsFile from "../registry/canonical-assets.json" with { type: "json" };
import entitiesFile from "../registry/entities.json" with { type: "json" };
import representationsFile from "../registry/representations.json" with { type: "json" };

export const canonicalAssets = canonicalAssetsFile.assets;
export const representations = representationsFile.representations;
export const assetGroups = assetGroupsFile.groups;
export const entities = entitiesFile.entities;

const requireRecord = (records, id, label) => {
  const record = records.find((candidate) => candidate.id === id);
  if (!record) throw new Error(`Unknown ${label}: ${id}`);
  return record;
};

export const getCanonicalAsset = (id) =>
  requireRecord(canonicalAssets, id, "canonical asset");
export const getRepresentation = (id) =>
  requireRecord(representations, id, "representation");
export const getEntity = (id) => requireRecord(entities, id, "entity");
export const getAssetGroups = (assetId) =>
  assetGroups.filter((group) => group.memberAssets.includes(assetId));

export const getAssetContext = (assetId) => ({
  asset: getCanonicalAsset(assetId),
  groups: getAssetGroups(assetId).map((group) => ({
    ...group,
    associations: (group.associations ?? []).map((association) => ({
      ...association,
      entity: getEntity(association.entity),
    })),
  })),
});
