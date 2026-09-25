export type RegistryEntityKind =
  "organization" | "brand" | "platform" | "protocol";

export interface RegistryEntity {
  id: string;
  name: string;
  kind: RegistryEntityKind;
  website?: string;
  sourceIds: string[];
}

export interface CanonicalAsset {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  lifecycle: "active" | "deprecated";
}

export interface AssetGroupAssociation {
  role: string;
  entity: string;
  sourceIds: string[];
}

export interface ResolvedAssetGroupAssociation extends Omit<
  AssetGroupAssociation,
  "entity"
> {
  entity: RegistryEntity;
}

export interface AssetGroup {
  id: string;
  kind: "market-exposure" | "product-family" | "protocol-ecosystem";
  name: string;
  description?: string;
  memberAssets: string[];
  associations?: AssetGroupAssociation[];
  sourceIds: string[];
}

export interface AssetRepresentation {
  id: string;
  canonicalAsset: string;
  chain: string;
  standard: string;
  identifier: string;
  decimals: number;
  verification: "verified" | "unverified";
  lifecycle: "active" | "deprecated";
  visibility: "required" | "default" | "optional" | "hidden";
  sourceIds: string[];
}

export const canonicalAssets: CanonicalAsset[];
export const representations: AssetRepresentation[];
export const assetGroups: AssetGroup[];
export const entities: RegistryEntity[];

export function getCanonicalAsset(id: string): CanonicalAsset;
export function getRepresentation(id: string): AssetRepresentation;
export function getEntity(id: string): RegistryEntity;
export function getAssetGroups(assetId: string): AssetGroup[];
export function getAssetContext(assetId: string): {
  asset: CanonicalAsset;
  groups: Array<
    Omit<AssetGroup, "associations"> & {
      associations: ResolvedAssetGroupAssociation[];
    }
  >;
};
