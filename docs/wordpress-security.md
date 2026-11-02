# WordPress security operations

## Deploy the anonymous frontend
Remove VITE_WP_USERNAME and VITE_WP_PASSWORD from build settings and local env files.
Build and deploy the new frontend; purge old assets from the hosting cache.
PUBLIC_API_URL is the public WordPress origin (no trailing slash); leave it empty
when /wp-json is reverse-proxied. Published companies and their public media must
be readable anonymously. Do not make private media public to work around a 401.
Verify company listing, images and language switching without cookies.

## Rotate exposed access
Identify the shared WordPress account used by the previous build. Change its
password through the administrator interface, destroy all its WordPress sessions,
and revoke its application passwords if any. Password changes alone may NOT
invalidate JWTs: follow the installed JWT plugin's revocation mechanism or rotate
JWT_AUTH_SECRET_KEY server-side and restart PHP. Key rotation logs out every
client using that signing key. Record affected integrations and verify old tokens
are rejected. Never paste passwords or signing keys into issues.

## Database migration
Copy Docker/wordpress/.env.example to .env in the same directory and generate
distinct random passwords (at least 32 random bytes each) using a password manager.
For an existing volume, first back up and verify recovery. Change the actual MySQL
user passwords using an authenticated administrative session, then update .env
and the existing mounted wp-config.php to the same new application password.
Do not assume changing Compose environment variables rotates existing database
users. Recreate services and confirm database connectivity. Do not delete volumes.
The mounted wp-config.php remains authoritative; ensure it reads the intended
environment setting or update its private configuration. Never commit it.
Compose binds WordPress to loopback; production needs an HTTPS reverse proxy.

## Inventory and CVE review
On the actual host, collect only version information:
- docker exec wordpress_app php -r 'echo PHP_VERSION, PHP_EOL;'
- wp core version
- wp plugin list --fields=name,status,version,update,update_version --format=json
- wp theme list --fields=name,status,version,update,update_version --format=json
Run wp commands in the WordPress installation with WP-CLI installed.
Record image digests from docker inspect without exporting environment secrets.
Include inactive plugins and themes. Check PHP security releases, WordPress
security announcements, and each plugin vendor advisory/WPScan entry against
these exact versions. Unknown versions must remain unresolved.

## Weekly maintenance and release gate
1. Review Dependabot PRs and collect the live inventory above weekly.
2. Match installed versions against advisories, including ACF and JWT authentication.
3. Back up database and uploads; test updates in staging.
4. Upgrade to supported patched PHP, WordPress, plugins and themes. Remove unused
   plugins after checking dependencies. Record tested image tags and digests.
5. Test anonymous company/media GETs, denied unauthenticated writes, admin login,
   and rejection of revoked sessions/JWTs; then deploy with rollback available.
6. Save inventory and advisory review date privately after each deployment.

Dependabot covers npm/Compose/Actions; it does not audit plugins installed in
host bind mounts. A floating wordpress:latest tag is not evidence of a patched
running site. This change does not automatically rotate live credentials.

References:
https://wordpress.org/documentation/article/updating-wordpress/
https://www.php.net/supported-versions.php
https://docs.github.com/en/code-security/dependabot/working-with-dependabot/dependabot-options-reference
