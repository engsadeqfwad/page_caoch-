import { database } from '../_shared/database.ts';
import { createRegistrationHandler } from '../_shared/registration-handler.ts';

Deno.serve(createRegistrationHandler({ env: (name) => Deno.env.get(name), database }));
