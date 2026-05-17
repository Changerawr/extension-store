# Changelog

All notable changes to the Unsplash Images extension will be documented in this file.

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
