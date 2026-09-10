import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
// v4 — the original owner photograph restored (AI v3 artwork retired for
// distorting faces, 10 September 2026). Checksum computed from the live file.
const expectedUrl = 'https://media.base44.com/images/public/69eb7905ca6eb4180010f794/cf2757c39_3d0e6cbc-87a7-4f9e-8d1c-05b82eb5b2e1.png';
const expectedSha256 = '9667a3698d14ec59d8b744d44a54692db5b24aefa09ed90e9344edd17eb83f98';

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function requireText(content, needle, message) {
  if (!content.includes(needle)) {
    throw new Error(message);
  }
}

const lock = read('src/config/storefrontArtLock.js');
const app = read('src/App.jsx');
const store = read('src/pages/Store.jsx');
const liveProducts = read('src/lib/liveStoreProducts.js');
const siteSearch = read('src/components/public/SiteSearch.jsx');
const storeTeaser = read('src/components/public/StoreWorldTeaser.jsx');
const hero = read('src/components/store/LockedStorefrontHero.jsx');

requireText(lock, expectedUrl, 'Storefront artwork URL changed or disappeared. The permanent boutique world lock has been violated.');
requireText(lock, expectedSha256, 'Storefront artwork checksum changed or disappeared. The permanent boutique world lock has been violated.');
requireText(app, '<Route path="/store" element={<Store />} />', 'The public /store route no longer points to the locked database driven store.');
requireText(store, '<LockedStorefrontHero', 'The locked boutique world hero was removed from the public store.');
requireText(store, 'fetchLiveStoreProducts', 'The public store no longer loads products through the shared live product source.');
requireText(liveProducts, "publication_status: 'live'", 'The shared product source no longer requires live publication status.');
requireText(liveProducts, 'is_stage_one_sale: true', 'The shared product source no longer fails closed to stage one products.');
requireText(liveProducts, 'MerchProduct.filter(LIVE_STORE_PRODUCT_FILTER', 'The shared product source is disconnected from MerchProduct.');
requireText(siteSearch, 'fetchLiveStoreProducts', 'Site search is not using the verified live product source.');
requireText(storeTeaser, 'fetchLiveStoreProducts', 'The homepage store teaser is not using the verified live product source.');
requireText(hero, "from '@/config/storefrontArtLock'", 'The storefront hero is no longer bound to the permanent lock file.');

// Owner-directed update (10 September 2026): the extra "world" sections
// (back wall + boutique stage) were removed from the public store. Scrolling
// now goes straight from the locked hero artwork to the live merchandise grid.

const sourceRoot = path.join(root, 'src');
const allowedUrlFile = path.normalize(path.join(sourceRoot, 'config/storefrontArtLock.js'));
const filesWithLockedUrl = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes(expectedUrl)) filesWithLockedUrl.push(path.normalize(full));
    }
  }
}

walk(sourceRoot);
if (filesWithLockedUrl.length !== 1 || filesWithLockedUrl[0] !== allowedUrlFile) {
  throw new Error(`The locked artwork URL must exist only in src/config/storefrontArtLock.js. Found: ${filesWithLockedUrl.join(', ')}`);
}

console.log('Storefront artwork lock verified.');