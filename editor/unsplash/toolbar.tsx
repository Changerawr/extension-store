import type { ExtensionToolbar } from '@/lib/services/extensions/sdk';
import { UnsplashBrowser } from '@/extensions/changerawr/unsplash/components/UnsplashBrowser';

export const unsplashToolbar: ExtensionToolbar = {
  buttons: [
    {
      id: 'unsplash',
      icon: 'ExtensionIcon',
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
      type: 'modal',
      component: UnsplashBrowser,
    },
  ],
};
