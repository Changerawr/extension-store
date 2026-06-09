# Changelog

## [1.3.0] - 2026-06-09

### Fixed
- Replaced Tailwind utility classes (`inline-block px-1 rounded`) with inline styles — Tailwind purges classes that only appear in runtime-generated strings, so padding and border-radius were stripped. Now fully self-contained with inline CSS.

## [1.2.9] - 2026-06-09

### Fixed
- `render` function was returning an object `{ tagName, attributes, content }` instead of an HTML string, causing `[object Object]` output

## [1.2.8] - 2026-06-09

### Fixed
- `renderRules[0]` used `name` instead of the required `type` field, causing "Render rule 0 must have a valid type" registration failure

## [1.0.0] - 2026-05-16

### Added
- Initial release of Highlight Block extension
- 6 different highlight block types (info, warning, success, error, tip, note)
- Each type with unique colors, icons, and styling
- Dark mode support with automatic color adjustments
- Responsive design for all screen sizes
- Tailwind CSS integration

### Features
- Simple `:::highlight type="TYPE"` syntax
- Icon support for each block type
- Supports nested markdown content
- Beautiful gradient backgrounds
- Border styling for visual hierarchy
- Prose styling for content readability
