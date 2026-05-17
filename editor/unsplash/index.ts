import type { Extension } from '@changerawr/markdown';
import { unsplashToolbar } from './toolbar';

export const metadata = {
  name: 'unsplash',
  displayName: 'Unsplash Images',
  version: '1.1.0',
  author: 'changerawr',
  description: 'Browse and insert high-quality images from Unsplash directly into your markdown. Requires free Unsplash API key.',
  category: 'media',
  icon: 'Image',
  isBuiltIn: false,
  toolbar: unsplashToolbar,
};

/**
 * Unsplash Extension
 *
 * This extension adds a toolbar button to browse and insert Unsplash images.
 * It requires an Unsplash API key which is stored encrypted in the database.
 *
 * The extension doesn't need to process any markdown - it just provides
 * a toolbar button that opens a modal for browsing/inserting images.
 *
 * Images are inserted as standard markdown: ![alt text](image_url)
 */
export const unsplashExtension: Extension = {
  name: 'unsplash',

  // No custom markdown syntax - uses standard image syntax
  parseRules: [],
  renderRules: [],
};
