import type { Extension, ExtensionMetadata } from '@changerawr/markdown';

export const metadata: ExtensionMetadata = {
    name: 'spoiler',
    displayName: 'Spoiler Block',
    version: '1.0.0',
    author: 'changerawr',
    description: 'Add collapsible spoiler blocks',
    category: 'blocks',
    isBuiltIn: false,
};

export const spoilerExtension: Extension = {
    parseRules: [
        {
            name: 'spoiler_block',
            pattern: /^:::spoiler\n([\s\S]*?)\n:::$/gm,
            replacement: (match, content) => {
                return `<spoiler>${content}</spoiler>`;
            },
        },
    ],
    renderRules: {
        spoiler: (content: string) => {
            return `
        <details class="spoiler-block">
          <summary>Click to reveal spoiler</summary>
          <div>${content}</div>
        </details>
      `;
        },
    },
};