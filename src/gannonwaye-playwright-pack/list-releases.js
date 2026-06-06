import { base44 } from '../api/base44Client.js';
import fs from 'fs';

async function main() {
  try {
    const list = await base44.entities.Release.list();
    console.log('Releases:', JSON.stringify(list, null, 2));
  } catch (err) {
    console.error('Error fetching releases:', err);
  }
}
main();
