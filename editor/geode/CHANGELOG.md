# Changelog

All notable changes to the GeodeMD extension will be documented in this file.

## [1.1.0] - 2026-06-09

### Fixed
- **Status badge URLs** - Badges now use the correct Geode API endpoint
  (`/v1/mods/MOD_ID/status_badge?stat=STAT`) instead of the old, non-functional
  `/badges/BADGE_TYPE` format
- **Badge stat IDs** - "GD Version" and "Geode Version" now use the correct
  `gd_version`/`geode_version` stat IDs (previously `gd`/`geode`)
- **Badge rendering** - Status badges now render as small, inline, clickable
  badges instead of being mis-rendered as large centered images
- Removed a leftover development-only WebSocket/eval connector from the
  extension's load hook (dead code, security risk)

## [1.0.3] - 2026-05-18

### Added
- **Complete UI Redesign** - Professional 3-tab toolkit interface
- **GD Links Tab** - Create clickable links with `user:`, `level:`, and `mod:` protocols
- **Geode Badges Tab** - Insert dynamic API-powered status badges
- **Link Transformation** - Automatic URL conversion for custom protocols
- **Multi-Select Badges** - Select and insert multiple badges at once
- **Live Link Preview** - See actual URLs before inserting
- **Badge Preview** - Visual preview of selected badge markdown
- **Tab Navigation** - Organized interface with Color Tags, GD Links, and Geode Badges tabs
- **Enhanced UI Components** - Grid layouts, selection indicators, hover states

### Changed
- Completely redesigned modal UI to match Unsplash extension quality
- Improved color picker with better visual feedback and spacing
- Enhanced live preview with better formatting
- Better button states and transitions
- More professional layout with proper scrolling
- Updated description to reflect all features

### Fixed
- Links now properly clickable and redirect to GDBrowser/Geode SDK
- Color tags render correctly in preview
- UI now properly uses screen space without clutter
- All features now fully functional (colors, links, badges)

## [1.0.2] - 2026-05-18

### Changed
- Complete redesign of UI with clean, professional color picker
- Simplified modal to single-purpose color tag insertion
- Improved color tag rendering with proper matching tags
- Better live preview with actual color display
- Removed broken features (badges, links) to focus on core functionality
- Updated documentation to reflect simplified approach

### Fixed
- Color tags now properly render in preview
- Fixed parsing to use matching tags instead of universal closing tag
- Improved UI layout and spacing
- Better visual feedback for selected colors

## [1.0.1] - 2026-05-17

### Fixes
- Fixed an issue in which toolbar object was not registered

## [1.0.0] - 2026-05-17

### Added
- Initial release of GeodeMD extension
- Support for all 14 official Geometry Dash color tags
- Color tags: `<cb>`, `<cg>`, `<cl>`, `<cj>`, `<cy>`, `<co>`, `<cr>`, `<cp>`, `<ca>`, `<cd>`, `<cc>`, `<cf>`, `<cs>`, `<c_>`
- Universal closing tag `</c>` for all color tags
- Accurate hex color codes matching Geometry Dash
- Full markdown compatibility
- Semi-bold font weight for colored text
- GeodeMD Toolkit modal with 3 tabs
- Support for Geode API status badges (version, downloads, GD version, Geode version)
- Special link protocols: `user:`, `level:`, `mod:`
- Auto-conversion to GDBrowser and Geode SDK URLs
- Color tag reference guide with visual swatches

### Features
- Parse and render GD color tags inline
- Mix color tags with bold, italic, links, and other markdown
- Works in both light and dark themes
- Zero CSS dependencies
- Automatic color application via inline styles
- Interactive badge selector with checkboxes
- Multi-badge insertion support
- Link builder for GD accounts, levels, and mods
- Click-to-insert color tags
- Preview for link syntax
- Tab-based toolkit interface

### Documentation
- Simplified README with essential information
- Color reference table with all 14 tags
- Badge usage instructions
- Quick examples
