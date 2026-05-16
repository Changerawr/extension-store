import type { Extension, ExtensionMetadata } from '@changerawr/markdown';
import { highlightToolbar } from './toolbar';

export const metadata: ExtensionMetadata = {
    name: 'highlight',
    displayName: 'Text Highlighter',
    version: '1.2.7',
    author: 'changerawr',
    description: 'Highlight text with hex colors. Pick from 7 presets or choose any custom color.',
    category: 'formatting',
    isBuiltIn: false,
    toolbar: highlightToolbar,
    icon: 'Highlighter',
};

export const highlightExtension: Extension = {
    name: 'highlight',
    parseRules: [
        {
            name: 'highlight-default',
            pattern: /==([^=\n]+)==/,
            render: (match: RegExpMatchArray) => {
                return {
                    type: 'highlight',
                    content: match[1] || '',
                    color: '#fef08a',  // Default yellow
                    raw: match[0] || '',
                };
            },
        },
        {
            name: 'highlight-colored',
            pattern: /==\{([^}]+)\}([^=\n]+)==/,
            render: (match: RegExpMatchArray) => {
                return {
                    type: 'highlight',
                    content: match[2] || '',
                    color: match[1] || '#fef08a',  // Default yellow
                    raw: match[0] || '',
                };
            },
        },
    ],
    renderRules: [
        {
            type: 'highlight',
            render: (token) => {
                const color = token.color || '#fef08a';  // Default yellow

                // All colors are now hex codes - simple inline styles
                return `<mark class="inline-block px-1 rounded transition-colors" style="background-color: ${color}; color: inherit;">${token.content}</mark>`;
            },
        },
    ],
};
