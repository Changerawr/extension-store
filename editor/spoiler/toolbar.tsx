import type { ToolbarButton } from '@changerawr/markdown';
import { Eye } from 'lucide-react';

export const spoilerToolbar: ToolbarButton[] = [
  {
    id: 'spoiler',
    icon: Eye,
    tooltip: 'Insert Spoiler Block',
    group: 'blocks',
    action: {
      type: 'insert',
      before: ':::spoiler\n',
      after: '\n:::',
      placeholder: 'Hidden content goes here',
    },
  },
];
