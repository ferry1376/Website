# Website

## Editing content with Decap CMS

This site uses Decap CMS at `/admin` to edit text and images.

### One-time GitHub OAuth setup

Decap CMS needs a GitHub OAuth application to authenticate editors. Configure an OAuth app and update `admin/config.yml` with the client details (see Decap CMS GitHub backend docs):

1. Create a GitHub OAuth App.
2. Set the callback URL to `https://esfahani-therapy.com/admin/`.
3. Add the `base_url` and `auth_endpoint` entries to `admin/config.yml` based on your OAuth app host.

Until the OAuth app is configured, `/admin` will load but logins will fail.
