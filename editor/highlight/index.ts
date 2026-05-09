import type { Extension, ExtensionMetadata } from '@changerawr/markdown';
import { highlightToolbar } from './toolbar';

export const metadata: ExtensionMetadata = {
    name: 'highlight',
    displayName: 'Text Highlighter',
    version: '1.2.5',
    author: 'changerawr',
    description: 'Highlight important text with customizable colors. Supports 7 preset colors and custom hex codes!',
    category: 'formatting',
    isBuiltIn: false,
    toolbar: highlightToolbar,
    icon: 'Highlighter',  // Lucide icon name
};

export const highlightExtension: Extension = {
    name: 'highlight',
    parseRules: [
        {
            name: 'highlight-yellow',
            pattern: /==([^=\n]+)==/,
            render: (match: RegExpMatchArray) => {
                return {
                    type: 'highlight',
                    content: match[1] || '',
                    color: 'yellow',
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
                    color: match[1] || 'yellow',
                    raw: match[0] || '',
                };
            },
        },
    ],
    renderRules: [
        {
            type: 'highlight',
            render: (token) => {
                const color = token.color || 'yellow';

                // Check if color is hex code
                const isHexColor = typeof color === 'string' && color.startsWith('#');

                if (isHexColor) {
                    // Use inline styles for hex colors
                    return `<mark class="inline-block px-1 rounded transition-colors" style="background-color: ${color}40; color: inherit;">${token.content}</mark>`;
                }

                // Named colors
                const colorMap: Record<string, { bg: string; text: string }> = {
                    yellow: { bg: 'bg-yellow-200/70 dark:bg-yellow-900/30', text: 'text-gray-900 dark:text-gray-100' },
                    green: { bg: 'bg-green-200/70 dark:bg-green-900/30', text: 'text-gray-900 dark:text-gray-100' },
                    blue: { bg: 'bg-blue-200/70 dark:bg-blue-900/30', text: 'text-gray-900 dark:text-gray-100' },
                    red: { bg: 'bg-red-200/70 dark:bg-red-900/30', text: 'text-gray-900 dark:text-gray-100' },
                    purple: { bg: 'bg-purple-200/70 dark:bg-purple-900/30', text: 'text-gray-900 dark:text-gray-100' },
                    pink: { bg: 'bg-pink-200/70 dark:bg-pink-900/30', text: 'text-gray-900 dark:text-gray-100' },
                    orange: { bg: 'bg-orange-200/70 dark:bg-orange-900/30', text: 'text-gray-900 dark:text-gray-100' },
                };

                const colors = colorMap[color as string] || colorMap.yellow;

                return `<mark class="inline-block px-1 rounded ${colors.bg} ${colors.text} transition-colors">${token.content}</mark>`;
            },
        },
    ],
};
