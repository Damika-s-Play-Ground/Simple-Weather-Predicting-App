# Security

## Reporting

Open a private GitHub security advisory on this repository, or open an issue
without exploit details and a maintainer will follow up.

## API key handling

The OpenWeather key is inlined into the client bundle at build time (`VITE_*`
env vars are public by design). Use a **restricted free-tier key** only.

Rotation steps:

1. Generate a new key at https://home.openweathermap.org/api_keys and revoke
   the old one.
2. Update the local `.env` (`VITE_OWM_KEY=...`).
3. Update the `REACT_APP_OWM_KEY` repository secret (Settings → Secrets and
   variables → Actions) — CI maps it to `VITE_OWM_KEY` at build time.

A key that was hardcoded in early git history is considered compromised and
must remain revoked. CI runs a secret-leak guard that fails on hardcoded
`appid=<hex>` patterns in source.
