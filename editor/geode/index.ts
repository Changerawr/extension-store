import type { Extension } from '@changerawr/markdown';
import { geodeToolbar } from './toolbar';

export const metadata = {
  name: 'geode',
  displayName: 'GeodeMD',
  version: '1.0.3',
  author: 'changerawr',
  description: 'Geometry Dash color tags for markdown with live preview and easy insertion.',
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
 * GeodeMD Extension - Geometry Dash Color Tags
 *
 * Syntax: <TAG>content</TAG>
 * Where TAG is one of: cb, cg, cl, cj, cy, co, cr, cp, ca, cd, cc, cf, cs, c_
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
};
