# Changelog

All notable changes to the Unsplash Images extension will be documented in this file.

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
