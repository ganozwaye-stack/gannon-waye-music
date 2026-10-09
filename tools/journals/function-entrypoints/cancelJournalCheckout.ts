// STAGED ONLY: never expire a real session during development testing.
import { handleJournalRequest } from '../handlers.candidate.ts';
Deno.serve(req => handleJournalRequest(req, 'expire'));
