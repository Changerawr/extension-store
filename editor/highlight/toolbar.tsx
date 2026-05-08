import type { ToolbarButton } from '@changerawr/markdown';
import { Highlighter } from 'lucide-react';

export const highlightToolbar: ToolbarButton[] = [
    {
        id: 'highlight',
        icon: Highlighter,
        tooltip: 'Highlight Text',
        group: 'formatting',
        action: {
            type: 'insert',
            before: '==',
            after: '==',
            placeholder: 'highlighted text',
        },
    },
];
