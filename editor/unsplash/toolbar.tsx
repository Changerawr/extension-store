import type { ExtensionToolbar } from '@changerawr/markdown';
import { UnsplashBrowser } from './components/UnsplashBrowser';

export const unsplashToolbar: ExtensionToolbar = {
  buttons: [
    {
      id: 'unsplash',
      icon: 'Image',
      tooltip: 'Insert Unsplash Image',
      group: 'media',
      onClick: (textarea) => {
        // This will trigger the popover to open
        // The actual popover rendering is handled by customUI below
      },
    },
  ],
  customUI: [
    {
      buttonId: 'unsplash',
      type: 'popover',
      component: UnsplashBrowser,
    },
  ],
};
