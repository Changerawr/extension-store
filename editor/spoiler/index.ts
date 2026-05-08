import type { Extension, ExtensionMetadata } from '@changerawr/markdown';
import { spoilerToolbar } from './toolbar';

export const metadata: ExtensionMetadata = {
    name: 'spoiler',
    displayName: 'Spoiler Block',
    version: '1.0.3',
    author: 'changerawr',
    description: 'Add collapsible spoiler blocks with customizable titles and colors',
    category: 'blocks',
    isBuiltIn: false,
    toolbar: spoilerToolbar,
};

export const spoilerExtension: Extension = {
    name: 'spoiler',
    parseRules: [
        {
            name: 'spoiler',
            // Pattern supports: :::spoiler or :::spoiler Title or :::spoiler{color} Title
            pattern: /:::spoiler(?:\{([^}]+)\})?(?: ([^\n]+))?\n([\s\S]*?)\n:::/,
            render: (match: RegExpMatchArray) => {
                return {
                    type: 'spoiler',
                    content: match[3]?.trim() || '',
                    raw: match[0] || '',
                    attributes: {
                        color: match[1]?.trim() || 'default',
                        title: match[2]?.trim() || 'Click to reveal spoiler',
                    }
                };
            },
        },
    ],
    renderRules: [
        {
            type: 'spoiler',
            render: (token) => {
                const color = token.attributes?.color || 'default';
                const title = token.attributes?.title || 'Click to reveal spoiler';

                // Color schemes
                const colorSchemes: Record<string, { border: string; bg: string; bgHover: string; text: string; icon: string }> = {
                    default: {
                        border: 'border-gray-300 dark:border-gray-700',
                        bg: 'bg-gray-50/50 dark:bg-gray-900/50',
                        bgHover: 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
                        text: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
                        icon: '🔒'
                    },
                    red: {
                        border: 'border-red-300 dark:border-red-800',
                        bg: 'bg-red-50/50 dark:bg-red-950/30',
                        bgHover: 'hover:bg-red-100/50 dark:hover:bg-red-900/40',
                        text: 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300',
                        icon: '⚠️'
                    },
                    yellow: {
                        border: 'border-yellow-300 dark:border-yellow-800',
                        bg: 'bg-yellow-50/50 dark:bg-yellow-950/30',
                        bgHover: 'hover:bg-yellow-100/50 dark:hover:bg-yellow-900/40',
                        text: 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300',
                        icon: '💡'
                    },
                    green: {
                        border: 'border-green-300 dark:border-green-800',
                        bg: 'bg-green-50/50 dark:bg-green-950/30',
                        bgHover: 'hover:bg-green-100/50 dark:hover:bg-green-900/40',
                        text: 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300',
                        icon: '✅'
                    },
                    blue: {
                        border: 'border-blue-300 dark:border-blue-800',
                        bg: 'bg-blue-50/50 dark:bg-blue-950/30',
                        bgHover: 'hover:bg-blue-100/50 dark:hover:bg-blue-900/40',
                        text: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
                        icon: 'ℹ️'
                    },
                    purple: {
                        border: 'border-purple-300 dark:border-purple-800',
                        bg: 'bg-purple-50/50 dark:bg-purple-950/30',
                        bgHover: 'hover:bg-purple-100/50 dark:hover:bg-purple-900/40',
                        text: 'text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300',
                        icon: '🔮'
                    },
                };

                const scheme = colorSchemes[color] || colorSchemes.default;

                // Use pre-rendered children from the renderer
                const renderedChildren = token.attributes?.renderedChildren as string | undefined;
                const renderedContent = renderedChildren || token.content;

                return `
          <details class="spoiler-block border border-dashed ${scheme.border} rounded-lg p-4 my-4 ${scheme.bg} transition-all ${scheme.bgHover} [&[open]_.spoiler-icon]:rotate-90">
            <summary class="cursor-pointer ${scheme.text} font-medium select-none flex items-center gap-2">
              <span class="spoiler-icon transition-transform inline-block duration-200">▶</span>
              <span class="text-lg" role="img" aria-label="spoiler">${scheme.icon}</span>
              <span>${title}</span>
            </summary>
            <div class="spoiler-content mt-3 pt-3 border-t ${scheme.border} prose dark:prose-invert max-w-none">
              ${renderedContent}
            </div>
          </details>
        `.trim();
            },
        },
    ],
};