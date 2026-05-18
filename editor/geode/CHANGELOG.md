# Changelog

All notable changes to the GeodeMD extension will be documented in this file.

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
