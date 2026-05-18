import type { Extension } from '@changerawr/markdown';
import { geodeToolbar } from './toolbar';

export const metadata = {
  name: 'geode',
  displayName: 'GeodeMD',
  version: '1.0.2',
  author: 'changerawr',
  description: 'Geometry Dash color tags and formatting for Geode mod documentation and level descriptions.',
  category: 'formatting',
  icon: 'Sparkles',
  invertIcon: true,
  isBuiltIn: false,
  toolbar: geodeToolbar,
};

/**
 * Color tag mapping for Geometry Dash
 */
const GD_COLOR_TAGS: Record<string, string> = {
  'cb': '#4A52E1',  // Blue
  'cg': '#40E348',  // Green
  'cl': '#60ABEF',  // Light blue
  'cj': '#32C8FF',  // Cyan
  'cy': '#FFFF00',  // Yellow
  'co': '#FF5A4B',  // Orange
  'cr': '#FF5A5A',  // Red
  'cp': '#FF00FF',  // Pink/Magenta
  'ca': '#9632FF',  // Purple
  'cd': '#FF96FF',  // Light pink
  'cc': '#FFFF96',  // Light yellow
  'cf': '#96FFFF',  // Light cyan
  'cs': '#FFDC41',  // Gold
  'c_': '#FF0000',  // Bright red
};

/**
 * GeodeMD Extension
 *
 * Supports Geometry Dash color tags in the format:
 * <cb>blue text</c>
 * <cg>green text</c>
 *
 * Syntax: <TAG>content</c>
 * Where TAG is one of: cb, cg, cl, cj, cy, co, cr, cp, ca, cd, cc, cf, cs, c_
 * And </c> closes all color tags
 */
export const geodeExtension: Extension = {
  name: 'geode',

  parseRules: [
    {
      name: 'gd-color-tag',
      type: 'inline',
      match: (text: string, pos: number) => {
        // Match <TAG> where TAG is a valid GD color tag
        const tagPattern = /<(c[bgljoyrpacdfs_])>/;
        const remaining = text.slice(pos);
        const match = remaining.match(tagPattern);

        if (!match || match.index !== 0) return null;

        const tag = match[1];
        const tagLength = match[0].length;

        // Find the closing </c> tag
        const closePattern = /<\/c>/;
        const afterTag = remaining.slice(tagLength);
        const closeMatch = afterTag.match(closePattern);

        if (!closeMatch) return null;

        const contentLength = closeMatch.index!;
        const content = afterTag.slice(0, contentLength);

        return {
          length: tagLength + contentLength + 4, // <TAG> + content + </c>
          data: {
            tag,
            content,
          },
        };
      },
    },
    {
      name: 'gd-special-link',
      type: 'inline',
      match: (text: string, pos: number) => {
        // Match [text](protocol:id) where protocol is user, level, or mod
        const linkPattern = /\[([^\]]+)\]\((user|level|mod):([^)]+)\)/;
        const remaining = text.slice(pos);
        const match = remaining.match(linkPattern);

        if (!match || match.index !== 0) return null;

        const [fullMatch, linkText, protocol, id] = match;

        return {
          length: fullMatch.length,
          data: {
            text: linkText,
            protocol,
            id,
          },
        };
      },
    },
  ],

  renderRules: [
    {
      name: 'gd-color-tag',
      render: (token: any) => {
        const { tag, content } = token.data;
        const color = GD_COLOR_TAGS[tag] || '#FFFFFF';

        return {
          tagName: 'span',
          attributes: {
            style: `color: ${color}; font-weight: 500;`,
            class: 'gd-color-tag',
            'data-gd-tag': tag,
          },
          content: content,
        };
      },
    },
    {
      name: 'gd-special-link',
      render: (token: any) => {
        const { text, protocol, id } = token.data;

        // Map protocol to URL
        const urlMap: Record<string, string> = {
          'user': `https://gdbrowser.com/u/${id}`,
          'level': `https://gdbrowser.com/${id}`,
          'mod': `https://geode-sdk.org/mods/${id}`,
        };

        const url = urlMap[protocol] || '#';

        return {
          tagName: 'a',
          attributes: {
            href: url,
            target: '_blank',
            rel: 'noopener noreferrer',
            class: 'gd-special-link',
            'data-gd-protocol': protocol,
          },
          content: text,
        };
      },
    },
  ],
};
