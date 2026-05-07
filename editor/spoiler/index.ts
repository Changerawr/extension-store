import type { Extension, ExtensionMetadata } from '@changerawr/markdown';
import { spoilerToolbar } from './toolbar';

export const metadata: ExtensionMetadata = {
    name: 'spoiler',
    displayName: 'Spoiler Block',
    version: '1.0.2',
    author: 'changerawr',
    description: 'Add collapsible spoiler blocks with markdown support',
    category: 'blocks',
    isBuiltIn: false,
    toolbar: spoilerToolbar,
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
          <details class="spoiler-block border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 my-4 bg-gray-50/50 dark:bg-gray-900/50 transition-all hover:bg-gray-100/50 dark:hover:bg-gray-800/50">
            <summary class="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium select-none flex items-center gap-2">
              <span class="spoiler-icon transition-transform">▶</span>
              <span>Click to reveal spoiler</span>
            </summary>
            <div class="spoiler-content mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 prose dark:prose-invert max-w-none">
              ##RECURSIVE##
            </div>
          </details>
          <style>
            details.spoiler-block[open] .spoiler-icon {
              transform: rotate(90deg);
            }
          </style>
        `.trim();
            },
        },
    ],
};