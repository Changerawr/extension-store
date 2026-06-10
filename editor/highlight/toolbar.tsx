import type { ExtensionToolbar } from '@/lib/services/extensions/sdk';
import { HighlightPopover } from './components/HighlightPopover';

export const highlightToolbar: ExtensionToolbar = {
    buttons: [
        {
            id: 'highlight',
            icon: 'Highlighter',
            tooltip: 'Highlight Text',
            group: 'formatting',
            onClick: (textarea: HTMLTextAreaElement) => {
                // This will trigger the popover to open
                // The actual popover rendering is handled by customUI below
            },
        },
    ],
    customUI: [
        {
            buttonId: 'highlight',
            type: 'popover',
            component: HighlightPopover,
        },
    ],
};
