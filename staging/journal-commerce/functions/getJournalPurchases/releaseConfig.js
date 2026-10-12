// Server-only, default closed. Populate only with approved immutable editions.
// No actual private file identifiers or credentials belong in the review package.
export const RELEASE_CONFIG=Object.freeze({
 enabled:false,liveMode:false,stripeKeyEnv:'',
 currentCatalogue:null,catalogues:{},privateDownloadHosts:[]
});
