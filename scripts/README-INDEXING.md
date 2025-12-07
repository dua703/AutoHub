# Google Indexing Automation for AutoHub

This script automates requesting Google indexing for AutoHub pages.

## Quick Start

```bash
# Index single URL
npm run index:google https://autohub.com/buy

# Index multiple URLs
npm run index:google https://autohub.com/buy https://autohub.com/sell https://autohub.com/car/123
```

## How It Works

1. **Checks robots.txt**: Verifies the URL is not blocked
2. **Validates URL**: Ensures it's an AutoHub URL
3. **Requests Indexing**: Provides instructions for Google Search Console

## Manual Indexing (Recommended)

Since Google Search Console requires authentication, the script provides manual instructions:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your AutoHub property
3. Use "URL Inspection" tool
4. Enter the URL
5. Click "Test Live URL"
6. Click "Request Indexing"

## Automated Indexing (Advanced)

For automated indexing via API:

1. **Set up Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create/select project
   - Enable "Google Search Console API"

2. **Create Service Account**:
   - Go to IAM & Admin > Service Accounts
   - Create new service account
   - Download JSON key

3. **Grant Access in Search Console**:
   - Go to Search Console > Settings > Users and permissions
   - Add service account email as owner

4. **Install Dependencies**:
   ```bash
   npm install googleapis
   ```

5. **Set Environment Variables**:
   ```bash
   export GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service@project.iam.gserviceaccount.com"
   export GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   export AUTOHUB_BASE_URL="https://autohub.com"
   ```

6. **Run Script**:
   ```bash
   npm run index:google https://autohub.com/buy
   ```

## Output Format

The script provides a summary table:

```
URL | Status | Notes
--------------------------------------------------
https://autohub.com/buy | Indexing requested successfully | Submitted via API
https://autohub.com/sell | Cannot index | Blocked by robots.txt
```

## Notes

- **Rate Limits**: Google allows ~200 indexing requests per day per property
- **Crawlability**: URLs must be publicly accessible and not blocked by robots.txt
- **Verification**: Only verified properties in Search Console can request indexing
- **Processing Time**: Indexing requests are processed within hours to days

## Troubleshooting

### "Blocked by robots.txt"
- Check `https://autohub.com/robots.txt`
- Ensure the URL path is not in Disallow rules

### "Not an Autohub URL"
- Ensure URLs start with your AutoHub domain
- Set `AUTOHUB_BASE_URL` environment variable if using custom domain

### "Cannot index"
- Verify the URL is accessible
- Check Search Console for crawl errors
- Ensure property is verified in Search Console

