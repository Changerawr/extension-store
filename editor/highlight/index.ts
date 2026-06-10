import type { Extension } from '@changerawr/markdown';
import type { ExtensionMetadata } from '@/lib/services/extensions/sdk';
import { highlightToolbar } from './toolbar';

export const metadata: ExtensionMetadata = {
    name: 'highlight',
    displayName: 'Text Highlighter',
    version: '1.5.0',
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
            scope: 'inline',
            pattern: /==([^=\n]+)==/,
            render: (match: RegExpMatchArray) => {
                return {
                    type: 'highlight',
                    content: match[1] || '',
                    raw: match[0] || '',
                    attributes: {
                        color: '#fef08a',
                    },
                };
            },
        },
        {
            name: 'highlight-colored',
            scope: 'inline',
            pattern: /==\{([^}]+)\}([^=\n]+)==/,
            render: (match: RegExpMatchArray) => {
                return {
                    type: 'highlight',
                    content: match[2] || '',
                    raw: match[0] || '',
                    attributes: {
                        color: match[1] || '#fef08a',
                    },
                };
            },
        },
    ],
    renderRules: [
        {
            type: 'highlight',
            render: (token) => {
                const color = (token.attributes?.color as string) || '#fef08a';
                const content = (token.attributes?.renderedChildren as string) || token.content;
                return `<mark style="background-color: ${color}; color: inherit; display: inline; padding: 1px 4px; border-radius: 3px;">${content}</mark>`;
            },
        },
    ],
};
