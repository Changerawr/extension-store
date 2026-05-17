# GeodeMD

Geometry Dash color tags for your markdown.

## Color Tags

| Tag | Color | Example |
|-----|-------|---------|
| `<cb>` | Blue | `<cb>text</c>` |
| `<cg>` | Green | `<cg>text</c>` |
| `<cl>` | Light Blue | `<cl>text</c>` |
| `<cj>` | Cyan | `<cj>text</c>` |
| `<cy>` | Yellow | `<cy>text</c>` |
| `<co>` | Orange | `<co>text</c>` |
| `<cr>` | Red | `<cr>text</c>` |
| `<cp>` | Pink | `<cp>text</c>` |
| `<ca>` | Purple | `<ca>text</c>` |
| `<cd>` | Light Pink | `<cd>text</c>` |
| `<cc>` | Light Yellow | `<cc>text</c>` |
| `<cf>` | Light Cyan | `<cf>text</c>` |
| `<cs>` | Gold | `<cs>text</c>` |
| `<c_>` | Bright Red | `<c_>text</c>` |

## Usage

```markdown
Welcome to my <cr>awesome</c> level!
This is <cb>blue</c> and <cg>green</c>.
```

Close any tag with `</c>`.

## Special Links

GeodeMD supports special link protocols:

- `user:<accountID>` - Link to GD account
- `level:<id>` - Link to GD level
- `mod:<id>` - Link to Geode mod

```markdown
Check out [user:12345](user:12345)
Play [level:67890](level:67890)
Install [mod:com.example.mod](mod:com.example.mod)
```

## Badges

Insert Geode mod badges from the API:

```markdown
![Mod Version](https://api.geode-sdk.org/v1/mods/YOUR_MOD_ID/status_badge?stat=version)
![Downloads](https://api.geode-sdk.org/v1/mods/YOUR_MOD_ID/status_badge?stat=downloads)
![GD Version](https://api.geode-sdk.org/v1/mods/YOUR_MOD_ID/status_badge?stat=gd_version)
![Geode Version](https://api.geode-sdk.org/v1/mods/YOUR_MOD_ID/status_badge?stat=geode_version)
```

Replace `YOUR_MOD_ID` with your mod's ID.
