import type { Extension, ExtensionMetadata } from '@changerawr/markdown';
import { highlightToolbar } from './toolbar';

export const metadata: ExtensionMetadata = {
    name: 'highlight',
    displayName: 'Text Highlighter',
    version: '1.3.0',
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
                    raw: match[0] || '',
                    data: {
                        color: '#fef08a',  // Default yellow
                    },
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
                    raw: match[0] || '',
                    data: {
                        color: match[1] || '#fef08a',  // Default yellow
                    },
                };
            },
        },
    ],
    renderRules: [
        {
            type: 'highlight',
            render: (token) => {
                const color = (token.data?.color as string) || '#fef08a';
                return `<mark style="background-color: ${color}; color: inherit; display: inline; padding: 1px 4px; border-radius: 3px;">${token.content}</mark>`;
            },
        },
    ],
};
