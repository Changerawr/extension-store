# GeodeMD

Comprehensive Geometry Dash enhancements for markdown. Add color tags, clickable links to GD content, and Geode API status badges with an intuitive toolkit.

## Features

- 🎨 **Color Tags** - 14 official GD colors with live preview
- 🔗 **GD Links** - Clickable links to users, levels, and mods
- 🏷️ **Geode Badges** - API-powered status badges for mods
- ⚡ **Quick Insert** - Professional 3-tab toolkit for all features
- 🎯 **Live Preview** - See your formatting before inserting

## Quick Start

Click the **GeodeMD** toolbar button to open the toolkit with three tabs:
1. **Color Tags** - Apply GD color formatting
2. **GD Links** - Create links to GD content
3. **Geode Badges** - Insert mod status badges

## Color Tags

### Usage

Use matching tags to color your text with official GD colors:

```markdown
<cb>blue text</cb>
<cg>green text</cg>
<cr>red text</cr>
```

### Available Colors

| Tag | Color | Hex Code |
|-----|-------|----------|
| `<cb>` | Blue | #4A52E1 |
| `<cg>` | Green | #40E348 |
| `<cl>` | Light Blue | #60ABEF |
| `<cj>` | Cyan | #32C8FF |
| `<cy>` | Yellow | #FFFF00 |
| `<co>` | Orange | #FF5A4B |
| `<cr>` | Red | #FF5A5A |
| `<cp>` | Pink | #FF00FF |
| `<ca>` | Purple | #9632FF |
| `<cd>` | Light Pink | #FF96FF |
| `<cc>` | Light Yellow | #FFFF96 |
| `<cf>` | Light Cyan | #96FFFF |
| `<cs>` | Gold | #FFDC41 |
| `<c_>` | Bright Red | #FF0000 |

### Example

```markdown
Welcome to <cb>Geometry Dash</cb>! This level has <cy>100 stars</cy> and is <cr>extremely hard</cr>!
```

## GD Links

Create clickable links that automatically redirect to GDBrowser or Geode SDK.

### Syntax

```markdown
[text](protocol:value)
```

### Supported Protocols

| Protocol | Redirects To | Example |
|----------|--------------|---------|
| `user:` | GDBrowser user profile | `[RobTop](user:RobTop)` |
| `level:` | GDBrowser level page | `[Bloodbath](level:10565740)` |
| `mod:` | Geode SDK mod page | `[Geode Loader](mod:geode.loader)` |

### Examples

```markdown
Check out [RobTop's profile](user:RobTop)!
Play [Bloodbath](level:10565740) - it's insane!
Download [Geode](mod:geode.loader) to use mods.
```

## Geode Badges

Insert dynamic status badges from the Geode API that show real-time mod information.

### Available Badges

- **Version** - Current mod version (e.g., v1.2.3)
- **Downloads** - Total download count (e.g., 1.2k downloads)
- **GD Version** - Compatible GD version (e.g., GD 2.206)
- **Geode Version** - Required Geode version (e.g., Geode v3.0.0)

### Syntax

```markdown
![badge-type](https://api.geode-sdk.org/v1/mods/MOD_ID/badges/BADGE_TYPE)
```

### Example

```markdown
![version](https://api.geode-sdk.org/v1/mods/geode.loader/badges/version)
![downloads](https://api.geode-sdk.org/v1/mods/geode.loader/badges/downloads)
```

## Complete Example

```markdown
# My Awesome GD Level

Welcome to <cy>Golden Valley</cy>! This is a <cb>medium demon</cb> level created by <cg>me</cg>!

## Details

- **ID**: [12345678](level:12345678)
- **Creator**: [MyUsername](user:MyUsername)
- **Difficulty**: <cr>Medium Demon</cr>

## Mods Used

I recommend using [Geode](mod:geode.loader) to play this level with these mods:

![version](https://api.geode-sdk.org/v1/mods/geode.loader/badges/version)
![downloads](https://api.geode-sdk.org/v1/mods/geode.loader/badges/downloads)

Have fun and <cy>good luck</cy>! <cb>GG</cb>!
```

## Tips

- **Color Tags**: Press Enter in the text field to quickly insert
- **Links**: Leave "Link Text" empty to use the ID/username as display text
- **Badges**: Select multiple badges to insert them all at once
- **Combining**: Mix color tags with other markdown formatting (bold, italic, etc.)

## Technical Details

- Color tags use inline CSS with `font-weight: 600` for emphasis
- Links use `target="_blank"` to open in new tabs
- Badges are live images from the Geode API
- All features work in both light and dark themes
- Zero external CSS dependencies
