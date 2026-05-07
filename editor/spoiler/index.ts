import type { Extension, ExtensionMetadata } from '@changerawr/markdown';

export const metadata: ExtensionMetadata = {
    name: 'spoiler',
    displayName: 'Spoiler Block',
    version: '1.0.1.',
    author: 'changerawr',
    description: 'Add collapsible spoiler blocks',
    category: 'blocks',
    isBuiltIn: false,
};

export const spoilerExtension: Extension = {
    name: 'spoiler',
    parseRules: [
        {
            name: 'spoiler',
            pattern: /:::spoiler\n([\s\S]*?)\n:::/,
            render: (match: RegExpMatchArray) => {
                return {
                    type: 'spoiler',
                    content: match[1]?.trim() || '',
                    raw: match[0] || '',
                };
            },
        },
    ],
    renderRules: [
        {
            type: 'spoiler',
            render: (token) => {
                return `
          <details class="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 my-4 bg-gray-50 dark:bg-gray-900">
            <summary class="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium select-none">
              ▼ Click to reveal spoiler
            </summary>
            <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              ${token.content}
            </div>
          </details>
        `.trim();
            },
        },
    ],
};