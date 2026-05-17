# Changelog

All notable changes to the Unsplash Images extension will be documented in this file.

## [1.3.0] - 2026-05-17

### Added
- **Multi-select support**: Hold Ctrl/Cmd while clicking to select multiple images
- **Insert Selected** button appears when images are selected to insert all at once
- Visual selection indicators with checkmarks on selected images
- Helper text in footer: "Click to insert, Ctrl+Click to select multiple"

### Changed
- Converted from popover to modal for larger, more spacious UI
- Increased image grid from 3 to 4 columns
- Simplified footer: removed background and border, cleaner text-only design
- Loading spinner no longer takes full height when searching (keeps search bar aligned)
- Fixed infinite scroll functionality for seamless browsing

### Improved
- Better UX: Single click inserts immediately, Ctrl+Click for multi-select
- Multiple images inserted with double line break separation for better markdown formatting
- Footer dynamically switches between Unsplash attribution and selection info

## [1.2.0] - 2026-05-17

### Changed
- **BREAKING**: Simplified settings structure - replaced `defaultSize` and `displayWidth` with single unified `imageSize` setting
- Image size now controls both download quality and display size using Unsplash's dynamic image API
- Enhanced image markdown syntax: `![alt](url "caption"){width=800 align=center}`
- Improved UI layout: 1200px × 650px modal with 3-column grid
- Better infinite scroll implementation with proper loading states

### Added
- Dynamic image resizing via Unsplash API: `?w={width}&q=80&fm=jpg&fit=max`
- Hover-only author attribution for cleaner image grid
- Support for built-in image extension enhancements (captions, sizing, alignment)

### Technical
- Uses `urls.raw` with dynamic width parameter for exact size control
- Single setting now controls both quality and display dimensions
- Improved settings caching for better performance

## [1.1.2] - 2026-05-17

### Fixed
- Fixed 404 error when fetching extension settings from toolbar
- Settings now properly retrieved using extension database ID instead of name lookup

### Technical
- Simplified settings fetching to use direct extensionId prop
- Removed unnecessary two-step lookup (name → ID → settings)
- More efficient API usage with single request instead of two

## [1.1.0] - 2026-05-17

### Fixed
- Fixed settings not being accessible when extension is accessed from toolbar
- Extension now properly fetches settings from API when needed
- API key is now correctly available in the image browser popover

### Changed
- Settings labels now support **bold**, *italic*, and [links](url) markdown formatting
- Settings descriptions now render markdown for better documentation
- Replaced browser checkbox with shadcn UI Checkbox component for consistent styling
- Extension components now receive `extensionName` prop for generic settings fetching

### Technical
- Implemented generic settings fetching by extension name → ID lookup
- Added fallback pattern: settings via props OR fetch from API
- Updated UnsplashBrowser component to handle both direct settings and API-fetched settings
- Improved toolbar integration with better prop passing

## [1.0.0] - 2026-05-17

### Added
- Initial release of Unsplash Images extension
- Browse and insert Unsplash images directly from the markdown editor
- Encrypted API key storage for security
- Configurable default image sizes (thumb, small, regular, full)
- Optional automatic photographer attribution
- Toolbar button for quick access
- Settings UI for API key and preferences configuration
- Comprehensive README with setup instructions
- Support for Unsplash API rate limiting

### Security
- API keys are encrypted using AES-256-GCM before storage
- Per-installation encryption keys
- PBKDF2 key derivation for additional security
