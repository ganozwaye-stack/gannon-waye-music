// Only opaque app-owned private storage references are accepted before signing.
// Legacy private/ references remain for existing editions and test fixtures.
export function isJournalPrivateUri(value) {
 if(typeof value!=='string'||value!==value.trim()||/[\x00-\x20\x7f\\%?#]/.test(value))return false;
 const prefix=value.startsWith('mp/private/69eb7905ca6eb4180010f794/')?'mp/private/69eb7905ca6eb4180010f794/':value.startsWith('private/')?'private/':null;
 if(!prefix)return false;
 const suffix=value.slice(prefix.length),parts=suffix.split('/');
 return !!suffix&&parts.every(part=>part&&part!=='.'&&part!=='..'&&/^[A-Za-z0-9_.()-]+$/.test(part));
}
