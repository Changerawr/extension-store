import type { Extension } from '@changerawr/markdown';
import { geodeToolbar } from './toolbar';

export const metadata = {
  name: 'geode',
  displayName: 'GeodeMD',
  version: '1.0.4',
  author: 'changerawr',
  description: 'Geometry Dash color tags, clickable GD links, and Geode API badges for markdown.',
  category: 'formatting',
  icon: 'Sparkles',
  invertIcon: true,
  isBuiltIn: false,
  toolbar: geodeToolbar,
};

const GD_COLORS: Record<string, string> = {
  cb: '#4A52E1',
  cg: '#40E348',
  cl: '#60ABEF',
  cj: '#32C8FF',
  cy: '#FFFF00',
  co: '#FF5A4B',
  cr: '#FF5A5A',
  cp: '#FF00FF',
  ca: '#9632FF',
  cd: '#FF96FF',
  cc: '#FFFF96',
  cf: '#96FFFF',
  cs: '#FFDC41',
  c_: '#FF0000',
};

/**
 * GeodeMD Extension - Geometry Dash Enhancements
 *
 * Features:
 * 1. Color Tags: <cb>text</cb>
 * 2. GD Links: [text](user:username), [text](level:id), [text](mod:id)
 * 3. Geode Badges: ![badge](https://api.geode-sdk.org/v1/mods/mod.id/badges/badge)
 */
export const geodeExtension: Extension = {
  name: 'geode',

  parseRules: [
    {
      name: 'gd-color',
      type: 'inline',
      match: (text: string, pos: number) => {
        const remaining = text.slice(pos);
        const tagNames = Object.keys(GD_COLORS).join('|');
        const pattern = new RegExp(`^<(${tagNames})>([^<]+)<\\/\\1>`);
        const match = remaining.match(pattern);

        if (!match) return null;

        return {
          length: match[0].length,
          data: {
            tag: match[1],
            content: match[2],
          },
        };
      },
    },
  ],

  renderRules: [
    {
      name: 'gd-color',
      render: (token: any) => {
        const { tag, content } = token.data;
        const color = GD_COLORS[tag] || '#FFFFFF';

        return {
          tagName: 'span',
          attributes: {
            style: `color: ${color}; font-weight: 600;`,
            class: 'gd-color-tag',
            'data-gd-color': tag,
          },
          content,
        };
      },
    },
  ],

  // Transform custom protocols (user:, level:, mod:) to actual URLs
  transformLink: (href: string, title?: string) => {
    // Match user:username
    if (href.startsWith('user:')) {
      const username = href.slice(5);
      return {
        href: `https://gdbrowser.com/u/${username}`,
        title: title || `GD User: ${username}`,
        target: '_blank',
        rel: 'noopener noreferrer',
      };
    }

    // Match level:id
    if (href.startsWith('level:')) {
      const levelId = href.slice(6);
      return {
        href: `https://gdbrowser.com/${levelId}`,
        title: title || `GD Level: ${levelId}`,
        target: '_blank',
        rel: 'noopener noreferrer',
      };
    }

    // Match mod:id
    if (href.startsWith('mod:')) {
      const modId = href.slice(4);
      return {
        href: `https://geode-sdk.org/mods/${modId}`,
        title: title || `Geode Mod: ${modId}`,
        target: '_blank',
        rel: 'noopener noreferrer',
      };
    }

    // Return unchanged for other links
    return { href, title };
  },
};
