import { base44 } from './src/api/base44Client.js';

async function main() {
  try {
    const list = await base44.entities.Release.list();
    console.log('Releases count:', list.length);
    console.log('Releases:', JSON.stringify(list, null, 2));
  } catch (err) {
    console.error('Error fetching releases:', err);
  }
}
main();
