// STAGED ONLY: not deployed; keep flags held until all integration checks pass.
import { handleJournalRequest } from '../handlers.candidate.ts';
Deno.serve(req => handleJournalRequest(req, 'checkout'));
