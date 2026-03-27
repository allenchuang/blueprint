# Caddy Config Snippets

These files are per-app Caddy reverse proxy configurations.

## Apply to production

Copy the relevant blocks into `/etc/caddy/Caddyfile`, replacing `{$BLUEPRINT_DOMAIN}` with the actual domain (e.g., `blueprintos.com`):

```caddyfile
paperclip.blueprintos.com {
    reverse_proxy localhost:3100
}
```

Then reload Caddy:
```bash
sudo systemctl reload caddy
```

## Port security note

Port 3100 (and all internal app ports) do NOT need to be open in the AWS Security Group.
Caddy handles TLS termination on ports 80/443 and routes traffic to internal ports.
Only ports 80 and 443 need to be publicly accessible.
