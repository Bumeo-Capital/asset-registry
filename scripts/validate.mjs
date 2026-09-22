import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = resolve(SCRIPT_DIR, '..');

const invariant = (condition, message) => {
  if (!condition) throw new Error(message);
};

const repositoryPath = (root, relativePath, label = relativePath) => {
  invariant(typeof relativePath === 'string' && relativePath.length > 0, `${label}: invalid path`);
  invariant(!isAbsolute(relativePath), `${label}: absolute paths are not allowed`);
  const resolvedRoot = resolve(root);
  const path = resolve(resolvedRoot, relativePath);
  invariant(path.startsWith(`${resolvedRoot}${sep}`), `${label}: path escapes repository root`);
  return path;
};

const readJson = (root, relativePath) => {
  const path = repositoryPath(root, relativePath);
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`${relativePath}: ${error.message}`);
  }
};

const indexUnique = (items, label) => {
  const result = new Map();
  for (const item of items) {
    invariant(item && typeof item.id === 'string' && item.id.length > 0, `${label}: missing id`);
    invariant(!result.has(item.id), `${label}: duplicate id ${item.id}`);
    result.set(item.id, item);
  }
  return result;
};

const validateSourceRefs = (record, sources, label) => {
  invariant(Array.isArray(record.sourceIds) && record.sourceIds.length > 0, `${label}: missing sourceIds`);
  for (const sourceId of record.sourceIds) {
    invariant(sources.has(sourceId), `${label}: unknown source ${sourceId}`);
  }
};

export const validateRegistry = (root = DEFAULT_ROOT) => {
  const manifest = readJson(root, 'registry/manifest.json');
  const chainFile = readJson(root, 'registry/chains.json');
  const assetFile = readJson(root, 'registry/canonical-assets.json');
  const representationFile = readJson(root, 'registry/representations.json');
  const connectionFile = readJson(root, 'registry/connections.json');

  for (const [name, data] of Object.entries({ manifest, chainFile, assetFile, representationFile, connectionFile })) {
    invariant(data.schemaVersion === 1, `${name}: unsupported schemaVersion`);
  }

  for (const file of manifest.files) {
    invariant(existsSync(repositoryPath(root, file, `manifest file ${file}`)), `manifest: missing file ${file}`);
  }

  const sources = indexUnique(manifest.sources, 'sources');
  const chains = indexUnique(chainFile.chains, 'chains');
  const assets = indexUnique(assetFile.assets, 'canonical assets');
  const representations = indexUnique(representationFile.representations, 'representations');
  const connections = indexUnique(connectionFile.connections, 'connections');

  const lifecycleValues = new Set(['active', 'deprecated']);
  const visibilityValues = new Set(['required', 'default', 'optional', 'hidden']);
  const verificationValues = new Set(['verified', 'unverified']);

  for (const asset of assets.values()) {
    invariant(lifecycleValues.has(asset.lifecycle), `canonical asset ${asset.id}: invalid lifecycle`);
    invariant(existsSync(repositoryPath(root, asset.logo, `canonical asset ${asset.id} logo`)), `canonical asset ${asset.id}: missing logo ${asset.logo}`);
  }

  for (const chain of chains.values()) {
    invariant(lifecycleValues.has(chain.lifecycle), `chain ${chain.id}: invalid lifecycle`);
    invariant(existsSync(repositoryPath(root, chain.logo, `chain ${chain.id} logo`)), `chain ${chain.id}: missing logo ${chain.logo}`);
    validateSourceRefs(chain, sources, `chain ${chain.id}`);
  }

  const localIdentities = new Set();
  for (const representation of representations.values()) {
    invariant(chains.has(representation.chain), `representation ${representation.id}: unknown chain ${representation.chain}`);
    invariant(assets.has(representation.canonicalAsset), `representation ${representation.id}: unknown canonical asset ${representation.canonicalAsset}`);
    invariant(representation.id.startsWith(`${representation.chain}/`), `representation ${representation.id}: id must start with its chain`);
    invariant(Number.isInteger(representation.decimals) && representation.decimals >= 0 && representation.decimals <= 255, `representation ${representation.id}: invalid decimals`);
    invariant(lifecycleValues.has(representation.lifecycle), `representation ${representation.id}: invalid lifecycle`);
    invariant(visibilityValues.has(representation.visibility), `representation ${representation.id}: invalid visibility`);
    invariant(verificationValues.has(representation.verification), `representation ${representation.id}: invalid verification`);
    validateSourceRefs(representation, sources, `representation ${representation.id}`);

    const localIdentity = `${representation.chain}:${representation.standard}:${representation.identifier.toLowerCase()}`;
    invariant(!localIdentities.has(localIdentity), `representations: duplicate local identity ${localIdentity}`);
    localIdentities.add(localIdentity);

    for (const provenance of representation.provenance ?? []) {
      const origin = representations.get(provenance.originRepresentation);
      invariant(origin, `representation ${representation.id}: unknown origin ${provenance.originRepresentation}`);
      invariant(origin.canonicalAsset === representation.canonicalAsset, `representation ${representation.id}: origin belongs to another canonical asset`);
      invariant(connections.has(provenance.transportRef), `representation ${representation.id}: unknown connection ${provenance.transportRef}`);
    }
    if (representation.standard === 'ibc') {
      invariant(Array.isArray(representation.provenance) && representation.provenance.length > 0, `representation ${representation.id}: IBC representation requires provenance`);
    }
  }

  for (const chain of chains.values()) {
    if (chain.nativeRepresentation === null) continue;
    const nativeRepresentation = representations.get(chain.nativeRepresentation);
    invariant(nativeRepresentation, `chain ${chain.id}: unknown native representation ${chain.nativeRepresentation}`);
    invariant(nativeRepresentation.chain === chain.id, `chain ${chain.id}: native representation is on another chain`);
  }

  for (const connection of connections.values()) {
    invariant(lifecycleValues.has(connection.lifecycle), `connection ${connection.id}: invalid lifecycle`);
    validateSourceRefs(connection, sources, `connection ${connection.id}`);
    invariant(Array.isArray(connection.evidenceUrls) && connection.evidenceUrls.length > 0, `connection ${connection.id}: missing evidenceUrls`);
    invariant(Array.isArray(connection.endpoints) && connection.endpoints.length === 2, `connection ${connection.id}: expected two endpoints`);
    const endpointChains = new Set();
    for (const endpoint of connection.endpoints) {
      invariant(chains.has(endpoint.chain), `connection ${connection.id}: unknown endpoint chain ${endpoint.chain}`);
      invariant(!endpointChains.has(endpoint.chain), `connection ${connection.id}: duplicate endpoint chain ${endpoint.chain}`);
      invariant(endpoint.endpointType === connection.protocol, `connection ${connection.id}: endpoint protocol mismatch`);
      endpointChains.add(endpoint.chain);
    }
    invariant(Array.isArray(connection.assetMappings) && connection.assetMappings.length > 0, `connection ${connection.id}: missing assetMappings`);
    for (const mapping of connection.assetMappings) {
      const source = representations.get(mapping.sourceRepresentation);
      const destination = representations.get(mapping.destinationRepresentation);
      invariant(source, `connection ${connection.id}: unknown source representation ${mapping.sourceRepresentation}`);
      invariant(destination, `connection ${connection.id}: unknown destination representation ${mapping.destinationRepresentation}`);
      invariant(source.canonicalAsset === destination.canonicalAsset, `connection ${connection.id}: mapping crosses canonical assets`);
      invariant(destination.provenance?.some((entry) => entry.originRepresentation === source.id && entry.transportRef === connection.id), `connection ${connection.id}: destination provenance mismatch`);
    }
  }

  for (const source of sources.values()) {
    if (!source.representationIds) continue;
    invariant(source.tokenCount === source.representationIds.length, `source ${source.id}: tokenCount does not match representationIds`);
    invariant(new Set(source.representationIds).size === source.representationIds.length, `source ${source.id}: duplicate representationIds`);
    for (const representationId of source.representationIds) {
      const representation = representations.get(representationId);
      invariant(representation, `source ${source.id}: unknown DEX representation ${representationId}`);
      invariant(representation.sourceIds.includes(source.id), `source ${source.id}: representation ${representationId} lacks source attribution`);
    }
  }

  for (const file of readdirSync(join(root, 'schemas'))) {
    if (file.endsWith('.json')) readJson(root, `schemas/${file}`);
  }

  return {
    chains: chains.size,
    canonicalAssets: assets.size,
    representations: representations.size,
    connections: connections.size,
    dexRepresentations: manifest.sources.find((source) => source.kind === 'api-snapshot')?.tokenCount ?? 0
  };
};

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    const counts = validateRegistry(process.argv[2] ? resolve(process.argv[2]) : DEFAULT_ROOT);
    console.log(`Registry valid: ${counts.chains} chains, ${counts.canonicalAssets} canonical assets, ${counts.representations} representations, ${counts.connections} connections, ${counts.dexRepresentations} DEX assets.`);
  } catch (error) {
    console.error(`Registry invalid: ${error.message}`);
    process.exitCode = 1;
  }
}
