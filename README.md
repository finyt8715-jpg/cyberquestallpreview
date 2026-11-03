# CyberQuest — preview-AllLevelsOpen

Ready-built static preview. No backend, database, secrets, npm install or build required.

## Deploy to Vercel

1. Extract the ZIP. The project root is the folder containing this README, vercel.json and public/.
2. Upload these extracted files to a Git repository and import it in Vercel, or run npx vercel from this folder (requires Node.js and a Vercel account).
3. Framework preset: Other. Build command: empty. Install command: empty. Output directory: public.
4. Deploy. The included vercel.json sets these values and security headers.

Vercel guide: https://vercel.com/docs/builds/configure-a-build

## Preview behaviour

- All implemented levels and mini-games are available on any hostname, including Vercel.
- The daily timer is paused; the header identifies this as an all-levels-open preview.
- Initial basics are optional; no quiz answers or completion records are fabricated.
- Firewall Blaster is available without first completing Data Sorter.
- Unbuilt modules remain Coming soon. Individual game rounds retain their normal rules.
- Sign-in is a local player profile, not verified company authentication.
- Progress is saved only in this browser. Standings and rewards are demonstration features.
- Admin demo mode is disabled. Backend, local admin server and timer-reset helper pages are excluded.
- Your main project's settings are unchanged. Use the main project for continued development.

Serve over HTTPS or a local web server; do not open index.html through file://.
