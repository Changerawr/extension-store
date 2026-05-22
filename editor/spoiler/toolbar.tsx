import type { ExtensionToolbar } from '@/lib/services/extensions/sdk';

export const spoilerToolbar: ExtensionToolbar = {
  buttons: [
    {
      id: 'spoiler',
      icon: 'Eye',
      tooltip: 'Insert Spoiler Block',
      group: 'blocks',
      action: {
        before: ':::spoiler\n',
        after: '\n:::',
        placeholder: 'Hidden content goes here',
      },
    },
  ],
};
