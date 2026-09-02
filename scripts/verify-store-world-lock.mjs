import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const fail = message => {
  console.error(`STORE WORLD LOCK FAILED: ${message}`);
  process.exit(1);
};

const EXPECTED_URL = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cf2757c39_3d0e6cbc-87a7-4f9e-8d1c-05b82eb5b2e1.png';
const lock = read('src/config/storeWorldLock.js');
const config = read('src/config/storeWorldConfig.js');
const hero = read('src/components/store/LockedStorefrontHero.jsx');
const app = read('src/App.jsx');
const world = read('src/pages/StoreWorld.jsx');
const modal = read('src/components/store/ProductQuickViewModal.jsx');

if (!lock.includes(`assetUrl: '${EXPECTED_URL}'`)) fail('the locked artwork URL changed');
if (!/assetSha256:\s*'[a-f0-9]{64}'/.test(lock)) fail('the artwork SHA256 is missing or invalid');
if (!lock.includes('locked: true')) fail('the owner lock is not enabled');
if (!lock.includes('ownerApprovalRequired: true')) fail('owner approval is not required');
if (!config.includes("from './storeWorldLock'")) fail('storeWorldConfig is not importing the owner lock');
if (!hero.includes('BOUTIQUE_HERO_IMAGE')) fail('the locked hero no longer uses the locked artwork constant');
if (!/<Route path="\/store" element={<StoreWorld \/>} \/>/.test(app)) fail('/store is not routed to StoreWorld');
if (/<Route path="\/store" element={<Store \/>} \/>/.test(app)) fail('/store was replaced by the plain product grid');
if (world.includes('STORE_PRODUCTS')) fail('StoreWorld is using a hard coded commercial catalogue');
if (!world.includes("publication_status: 'live'")) fail('StoreWorld is not querying verified live products');
if (!world.includes('is_active: true')) fail('StoreWorld is not enforcing the active product gate');
if (modal.includes('STORE_ADDONS') || modal.includes('STORE_PRODUCTS')) fail('the purchase modal can still mount hard coded products or add ons');
if (!modal.includes('addItem(product')) fail('the purchase modal is not adding the verified database record');

console.log('Store world owner lock and verified product mounting passed.');
