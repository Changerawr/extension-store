# Unsplash Images Extension

Browse and insert high-quality, royalty-free images from Unsplash directly into your markdown documents.

## Features

- 🖼️ **Browse Unsplash Library** - Access millions of high-quality photos
- 🔐 **Secure API Key Storage** - Your API key is encrypted and stored securely
- 📐 **Flexible Image Sizes** - Choose from thumbnail to full resolution
- 👤 **Automatic Attribution** - Photographer credits added automatically (required by Unsplash)
- ⚡ **Quick Insert** - Add images with a single click from the toolbar

## Setup

### 1. Get an Unsplash API Key

1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Sign in or create a free account
3. Create a new application
4. Copy your **Access Key** (not the Secret Key)

### 2. Configure the Extension

1. Go to **Extensions** in your dashboard
2. Find **Unsplash Images** in your installed extensions
3. Click **Settings**
4. Paste your API key
5. Choose your preferred default image size
6. Enable/disable automatic attribution
7. Click **Save Settings**

## Usage

### Insert an Image

1. Click the **Image** icon in the markdown toolbar
2. Browse or search for images
3. Click on an image to insert it

### Settings

- **API Key** (Required): Your Unsplash Access Key - stored encrypted
- **Default Image Size**: Choose between thumb, small, regular, or full resolution
- **Include Attribution**: Add photographer credits (recommended and required by Unsplash guidelines)

## Image Sizes

- **Thumb**: 200px width - ideal for previews
- **Small**: 400px width - good for inline images
- **Regular**: 1080px width - standard for most uses
- **Full**: Original resolution - best quality

## Attribution

When you insert an image with attribution enabled, it will include:
- Image from Unsplash
- Photographer name and link
- Unsplash link

Example:
```markdown
![Mountain landscape](https://images.unsplash.com/photo-xyz?w=1080)
*Photo by [John Doe](https://unsplash.com/@johndoe) on Unsplash*
```

## Privacy & Security

- Your API key is **encrypted** before being stored in the database using AES-256-GCM encryption
- The key is only decrypted when needed to make API requests
- No unencrypted API keys are ever stored or logged

## Troubleshooting

### "Please configure your Unsplash API key"

Make sure you've:
1. Added your API key in extension settings
2. Saved the settings
3. The key is a valid Unsplash Access Key

### Images not loading

- Check that your API key is valid
- Verify you haven't exceeded your rate limit (50 requests/hour for free tier)
- Ensure you have an active internet connection

## API Rate Limits

Unsplash free tier allows:
- **50 requests per hour**
- Upgrade to paid for higher limits

## License

Images from Unsplash are free to use under the [Unsplash License](https://unsplash.com/license).

## Support

- [Unsplash API Documentation](https://unsplash.com/documentation)
- [Unsplash Guidelines](https://unsplash.com/api-terms)
