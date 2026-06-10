import type { Extension } from '@/lib/services/extensions/sdk';
import { geodeToolbar } from './toolbar';

export const metadata = {
  name: 'geode',
  displayName: 'GeodeMD',
  version: '1.1.0',
  author: 'changerawr',
  description: 'Geometry Dash color tags, clickable GD links, and Geode API status badges for markdown.',
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
 * Stat IDs accepted by the Geode API status badge endpoint:
 * https://api.geode-sdk.org/v1/mods/{MOD_ID}/status_badge?stat={stat}
 */
const GEODE_BADGE_STATS = ['version', 'downloads', 'gd_version', 'geode_version'] as const;

/** Matches a Geode API status badge image, e.g. ![Version](https://api.geode-sdk.org/v1/mods/geode.loader/status_badge?stat=version) */
const GEODE_BADGE_PATTERN = /!\[([^\]]*)\]\(https:\/\/api\.geode-sdk\.org\/v1\/mods\/([\w.-]+)\/status_badge\?stat=(version|downloads|gd_version|geode_version)\)/g;

/** Escapes a string for safe use inside an HTML attribute. */
const escapeAttr = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * GeodeMD Extension - Geometry Dash Enhancements
 *
 * Features:
 * 1. Color Tags: <cb>text</cb>
 * 2. GD Links: [text](user:username), [text](level:id), [text](mod:id)
 * 3. Geode Status Badges: ![badge](https://api.geode-sdk.org/v1/mods/mod.id/status_badge?stat=version)
 */
export const geodeExtension: Extension = {
  name: 'geode',

  // Post-process HTML to convert escaped color tags back to working color tags
  postProcessHtml: (html: string): string => {
    // Find HTML-escaped color tags like &lt;cg&gt;text&lt;/c&gt; and convert them to spans
    return html.replace(
      /&lt;(cb|cg|cl|cj|cy|co|cr|cp|ca|cd|cc|cf|cs|c_)&gt;((?:(?!&lt;\/c&gt;).)+)&lt;\/c&gt;/g,
      (_, tag, content) => {
        const color = GD_COLORS[tag] || '#FFFFFF';
        return `<span style="color: ${color}; font-weight: 600;" class="gd-color-tag" data-gd-color="${tag}">${content}</span>`;
      }
    );
  },

  parseRules: [
    {
      name: 'geode-badge',
      scope: 'both',
      pattern: GEODE_BADGE_PATTERN,
      // Higher than the generic image extension's auto-calculated priority so
      // status badges render as small inline badges instead of full-size images.
      priority: 900,
      render: (match: RegExpMatchArray) => {
        const alt = match[1] || '';
        const modId = match[2] || '';
        const stat = (match[3] || 'version') as typeof GEODE_BADGE_STATS[number];

        return {
          type: 'geode-badge',
          content: '',
          raw: match[0] || '',
          attributes: { alt, modId, stat },
        };
      },
    },
    {
      name: 'gd-color',
      scope: 'inline',
      // Match any GD color tag: <cb>text</c>, <cg>text</c>, etc.
      // Closing tag is always </c> regardless of opening tag
      // Priority 400: MEDIUM - Process after block elements but before text
      // This allows it to work as an inline element within bold/italic
      // Pattern captures any content including nested HTML from bold/italic
      pattern: /<(cb|cg|cl|cj|cy|co|cr|cp|ca|cd|cc|cf|cs|c_)>((?:(?!<\/c>)[\s\S])+)<\/c>/g,
      priority: 400,
      render: (match: RegExpMatchArray) => {
        const openTag = match[1];
        const content = match[2];

        return {
          type: 'gd-color',
          content: content || '',
          raw: match[0] || '',
          attributes: {
            tag: openTag || '',
          },
        };
      },
    },
  ],

  renderRules: [
    {
      type: 'geode-badge',
      render: (token: any): string => {
        const alt = (token.attributes?.alt as string) || '';
        const modId = (token.attributes?.modId as string) || '';
        const stat = (token.attributes?.stat as string) || 'version';

        const src = `https://api.geode-sdk.org/v1/mods/${encodeURIComponent(modId)}/status_badge?stat=${stat}`;
        const img = `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" class="inline-block align-middle h-5 w-auto" loading="lazy" />`;

        return `<a href="https://geode-sdk.org/mods/${encodeURIComponent(modId)}" target="_blank" rel="noopener noreferrer" class="geode-badge inline-flex align-middle mr-1 mb-1 hover:opacity-80 transition-opacity">${img}</a>`;
      },
    },
    {
      type: 'gd-color',
      render: (token: any): string => {
        const tag = token.attributes?.tag || '';
        const color = GD_COLORS[tag] || '#FFFFFF';

        // Content may already be HTML from bold/italic processing
        // Just wrap it in the color span without escaping
        const content = token.content || '';

        // Return HTML string directly (uses <span> which bypasses sanitization)
        // Content is already processed HTML from earlier parsing stages
        return `<span style="color: ${color}; font-weight: 600;" class="gd-color-tag" data-gd-color="${tag}">${content}</span>`;
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
