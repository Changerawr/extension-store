# Changerawr Extensions

Official extension collection for Changerawr markdown editor.

## Extension Development

### Icons

Extensions can specify an icon in two ways:

1. **Lucide Icon Name** (recommended): Add an `icon` field to `extension.json` with a Lucide icon name
   ```json
   {
     "name": "highlight",
     "displayName": "Text Highlighter",
     "icon": "Highlighter"
   }
   ```

2. **Custom Image**: Include an `icon.png` file (will be auto-converted to base64)

If both are present, the `icon` field in `extension.json` takes precedence.

Browse available Lucide icons at: https://lucide.dev/icons/

## Available Extensions

### Editor Extensions

#### Spoiler Block
**Install URL**: `https://github.com/changerawr/changerawr-extensions/tree/main/editor/spoiler`

Add collapsible spoiler blocks to hide content.

**Syntax**:
\`\`\`markdown
:::spoiler
Hidden content
:::
\`\`\`