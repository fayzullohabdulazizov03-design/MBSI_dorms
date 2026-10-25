# Cloud Sync Setup

The app uses Supabase Auth and one shared JSON snapshot so staff devices see the same students and attendance. Browser code uses only the Supabase project URL and public anon/publishable key. Never put a `service_role` key in this project.

## 1. Create Supabase project

1. Create a Supabase project and keep its database password private.
2. In **SQL Editor**, run all statements from `supabase-setup.sql`.
3. In **Authentication > Providers > Email**, keep email/password enabled and turn off public sign-ups.
4. In **Authentication > Users**, create an account for each authorized staff member. Do not share one password if staff need individual access.
5. Copy the Project URL and the public anon/publishable key from **Project Settings > API**.

The SQL enables row-level security. Only authenticated users can read or change the shared state. The `dormitory_state` table contains student contact details, so do not add public/anonymous policies.

## 2. Configure and deploy to Vercel

1. Put this workspace in a Git repository and import it into Vercel.
2. In `supabase-config.js`, set `DORM_SUPABASE_URL` and `DORM_SUPABASE_ANON_KEY` to the Supabase values. These are public client values; the anon key is protected by Auth and RLS, not kept secret.
3. Deploy the repository. `vercel.json` maps the site root to the existing HTML app.
4. Open the Vercel URL, sign in with an authorized staff account, and verify the sidebar says `Bulut bilan sinxron`.
5. On a second device, open the same Vercel URL and sign in with another authorized account. Changes sync after save; keep the site online while syncing.

## 3. Move existing browser data

If the existing data is only in the old browser origin, use that original app/device before switching to Vercel:

1. Open the old app on the device that has the latest student and attendance data.
2. Click `Zaxira olish` in the sidebar. Keep the downloaded JSON backup private; it contains student contact details.
3. Deploy the configured Vercel app, sign in, then click `Bulutga ko‘chirish` and select the backup file.
4. Confirm both prompts. This intentionally replaces the cloud snapshot with the selected backup; other signed-in devices will receive the imported data.
5. Keep the backup in a private location until the other device has confirmed the students are visible.

The first signed-in device initializes an empty cloud row from its local data. Devices that find an existing cloud row load that shared data instead of replacing it with local demo data.

## Notes

- Data is shared only among signed-in users of this Supabase project, not with every Vercel visitor.
- Supabase free-tier projects may pause when inactive. Check the project status if sync becomes unavailable.
- This starter uses a single shared snapshot. It is suitable for a small staff group but simultaneous saves can overwrite one another. For larger teams, migrate to normalized per-student/per-attendance tables with conflict handling.