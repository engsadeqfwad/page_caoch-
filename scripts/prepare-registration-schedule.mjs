import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export function buildScheduleSetupSql(retrySecret) {
  if (typeof retrySecret !== 'string' || !/^[a-f0-9]{64}$/i.test(retrySecret)) {
    throw new Error('The saved registrationRetrySecret variable is missing or invalid. Use the same PowerShell terminal where it was generated.');
  }
  const schedule = readFileSync(new URL('../supabase/ops/schedule-registration-emails.sql', import.meta.url), 'utf8');
  const vault = `do $registration_vault$
declare
  item record;
  secret_id uuid;
begin
  for item in
    select * from (values
      ('registration_project_url', 'https://jajwrjblsbdfbhbrfyku.supabase.co'),
      ('registration_retry_secret', '${retrySecret}')
    ) as setup_values(name, value)
  loop
    select id into secret_id from vault.secrets where name = item.name;
    if secret_id is null then
      perform vault.create_secret(item.value, item.name);
    else
      perform vault.update_secret(secret_id, item.value);
    end if;
  end loop;
end;
$registration_vault$;`;
  return `begin;\n${vault}\n\n${schedule}\ncommit;\n`;
}

if (process.argv[1] && pathToFileURL(fileURLToPath(pathToFileURL(process.argv[1]))).href === import.meta.url) {
  try {
    const sql = buildScheduleSetupSql(process.argv[2]);
    const copied = spawnSync('clip.exe', [], { input: sql, encoding: 'utf8', windowsHide: true });
    if (copied.error || copied.status !== 0) throw new Error('Could not copy SQL to the clipboard.');
    console.log('SQL COPIED. Open a NEW query in the intended Supabase project, paste, and click Run.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
