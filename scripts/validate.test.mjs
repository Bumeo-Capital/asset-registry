import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { validateRegistry } from './validate.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const temporaryRegistry = () => {
  const root = mkdtempSync(join(tmpdir(), 'lsf-asset-registry-'));
  for (const directory of ['registry', 'schemas', 'images']) {
    cpSync(join(ROOT, directory), join(root, directory), { recursive: true });
  }
  return root;
};

test('validates the checked-in registry and DEX snapshot coverage', () => {
  assert.deepEqual(validateRegistry(ROOT), {
    chains: 7,
    canonicalAssets: 15,
    entities: 5,
    assetGroups: 2,
    representations: 29,
    connections: 9,
    dexRepresentations: 8
  });
});

test('keeps wSPYx identity separate from its exposure, issuer, brand and distributors', () => {
  const { assets } = JSON.parse(readFileSync(join(ROOT, 'registry/canonical-assets.json'), 'utf8'));
  const { groups } = JSON.parse(readFileSync(join(ROOT, 'registry/asset-groups.json'), 'utf8'));

  assert.equal(assets.find((asset) => asset.id === 'wspyx').symbol, 'wSPYx');
  assert(groups.find((group) => group.id === 'sp500-etf-exposure').memberAssets.includes('wspyx'));

  const xStocks = groups.find((group) => group.id === 'xstocks-products');
  assert(xStocks.memberAssets.includes('wspyx'));
  assert(xStocks.associations.some((entry) => entry.role === 'issuer' && entry.entity === 'backed-assets-je'));
  assert(xStocks.associations.some((entry) => entry.role === 'brand' && entry.entity === 'xstocks'));
  assert(xStocks.associations.some((entry) => entry.role === 'offeror-outside-eea' && entry.entity === 'payward-digital-solutions'));
  assert(xStocks.associations.some((entry) => entry.role === 'platform' && entry.entity === 'kraken'));
});

test('rejects asset groups that reference an unknown entity', (context) => {
  const root = temporaryRegistry();
  context.after(() => rmSync(root, { recursive: true, force: true }));
  const file = join(root, 'registry/asset-groups.json');
  const data = JSON.parse(readFileSync(file, 'utf8'));
  data.groups[1].associations[0].entity = 'unknown-issuer';
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

  assert.throws(() => validateRegistry(root), /unknown entity unknown-issuer/);
});

test('rejects duplicate chain-local identities', (context) => {
  const root = temporaryRegistry();
  context.after(() => rmSync(root, { recursive: true, force: true }));
  const file = join(root, 'registry/representations.json');
  const data = JSON.parse(readFileSync(file, 'utf8'));
  data.representations.push({
    ...data.representations[0],
    id: 'terra-classic/duplicate-lunc'
  });
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

  assert.throws(() => validateRegistry(root), /duplicate local identity/);
});

test('rejects a bridge mapping across canonical assets', (context) => {
  const root = temporaryRegistry();
  context.after(() => rmSync(root, { recursive: true, force: true }));
  const file = join(root, 'registry/connections.json');
  const data = JSON.parse(readFileSync(file, 'utf8'));
  data.connections[0].assetMappings[0].sourceRepresentation = 'terra-classic/uluna';
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

  assert.throws(() => validateRegistry(root), /mapping crosses canonical assets/);
});

test('rejects registry paths that escape the repository', (context) => {
  const root = temporaryRegistry();
  context.after(() => rmSync(root, { recursive: true, force: true }));
  const file = join(root, 'registry/canonical-assets.json');
  const data = JSON.parse(readFileSync(file, 'utf8'));
  data.assets[0].logo = '../outside.svg';
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);

  assert.throws(() => validateRegistry(root), /path escapes repository root/);
});

test('wallet canonical groups retain exact locations and provenance-only exclusions', () => {
  const { representations } = JSON.parse(readFileSync(join(ROOT, 'registry/representations.json'), 'utf8'));
  for (const [canonical, networks, count] of [
    ['lunc', 4, 4],
    ['ustc', 4, 4],
    ['juris', 2, 2],
    ['osmo', 2, 2],
    ['inj', 2, 2],
    ['usdc', 2, 3]
  ]) {
    const group = representations.filter((entry) => entry.canonicalAsset === canonical && entry.visibility !== 'hidden');
    assert.equal(group.length, count, canonical);
    assert.equal(new Set(group.map((entry) => entry.chain)).size, networks, canonical);
    assert(group.every((entry) => entry.verification === 'verified' && entry.lifecycle === 'active'));
  }
  for (const id of ['noble/uusdc', 'osmosis/allbtc', 'ethereum/erc20-wspyx-v2']) {
    assert.equal(representations.find((entry) => entry.id === id).visibility, 'hidden');
  }
});
