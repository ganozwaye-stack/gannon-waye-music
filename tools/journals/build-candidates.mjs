// Builds reviewable self-contained staged functions under /tmp. Does not deploy.
import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
const output='/tmp/gw-journal-function-candidates';
await mkdir(output,{recursive:true});
for(const name of ['createJournalCheckout','getJournalPurchases','confirmJournalPurchase','downloadJournal','cancelJournalCheckout']){
 await build({entryPoints:['tools/journals/function-entrypoints/'+name+'.ts'],
 outfile:output+'/'+name+'.ts',bundle:true,format:'esm',platform:'neutral',target:'es2022',external:['npm:*']});
}
console.log('Built five staged function candidates under '+output+'; no deployment performed.');
