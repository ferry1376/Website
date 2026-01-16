# Website

## Editing content with Decap CMS

This site uses Decap CMS at `/admin` to edit text and images.

### One-time GitHub OAuth setup

Decap CMS needs a GitHub OAuth application (plus an OAuth proxy) to authenticate editors. Configure an OAuth app and update `admin/config.yml` with the client details (see Decap CMS GitHub backend docs):

1. Create a GitHub OAuth App.
2. Set the callback URL to `https://esfahani-therapy.com/admin/`.
3. Deploy or configure an OAuth proxy (for GitHub Pages, most teams use the open-source `netlify-cms-oauth-provider`).
4. Add the `base_url` and `auth_endpoint` entries to `admin/config.yml` pointing to that OAuth proxy.

Until the OAuth app is configured, `/admin` will load but logins will fail.
