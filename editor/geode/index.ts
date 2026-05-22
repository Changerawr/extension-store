import type { Extension } from '@/lib/services/extensions/sdk';
import { geodeToolbar } from './toolbar';

export const metadata = {
  name: 'geode',
  displayName: 'GeodeMD',
  version: '1.0.5',
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

  // Connect to dev tools server when extension loads
  onLoad: () => {
    if (typeof window === 'undefined') return;

    // Only connect in development mode
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev) return;

    const DEV_SERVER_PORT = 3737;
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;

    const connect = () => {
      try {
        ws = new WebSocket(`ws://localhost:${DEV_SERVER_PORT}`);

        ws.onopen = () => {
          console.log('[GeodeMD] Connected to dev server');
          // Send initial connection message
          ws?.send(JSON.stringify({
            type: 'log',
            data: 'GeodeMD extension loaded and connected',
          }));
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            // Handle different message types from dev server
            switch (message.type) {
              case 'init':
                console.log('[GeodeMD] Received breakpoints:', message.breakpoints);
                break;

              case 'eval':
                // Execute code from dev server REPL
                try {
                  const result = eval(message.code);
                  ws?.send(JSON.stringify({
                    type: 'log',
                    data: `Eval result: ${JSON.stringify(result)}`,
                  }));
                } catch (error) {
                  ws?.send(JSON.stringify({
                    type: 'error',
                    data: `Eval error: ${error instanceof Error ? error.message : String(error)}`,
                  }));
                }
                break;

              case 'breakpoint':
                if (message.action === 'add') {
                  console.log('[GeodeMD] Breakpoint added:', message.breakpoint);
                } else if (message.action === 'clear') {
                  console.log('[GeodeMD] Breakpoints cleared');
                }
                break;

              default:
                console.log('[GeodeMD] Unknown message type:', message.type);
            }
          } catch (error) {
            console.error('[GeodeMD] Failed to parse message:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('[GeodeMD] WebSocket error:', error);
        };

        ws.onclose = () => {
          console.log('[GeodeMD] Disconnected from dev server');
          ws = null;

          // Attempt to reconnect after 5 seconds
          if (reconnectTimer) clearTimeout(reconnectTimer);
          reconnectTimer = setTimeout(() => {
            console.log('[GeodeMD] Attempting to reconnect...');
            connect();
          }, 5000);
        };
      } catch (error) {
        console.error('[GeodeMD] Failed to connect to dev server:', error);

        // Retry connection after 5 seconds
        if (reconnectTimer) clearTimeout(reconnectTimer);
        reconnectTimer = setTimeout(connect, 5000);
      }
    };

    // Initial connection
    connect();

    // Cleanup on unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        if (reconnectTimer) clearTimeout(reconnectTimer);
        if (ws) {
          ws.close();
          ws = null;
        }
      });
    }
  },

  parseRules: [
    {
      name: 'gd-color',
      // Match any GD color tag: <cb>text</c>, <cg>text</c>, etc.
      // Closing tag is always </c> regardless of opening tag
      // Priority 400: MEDIUM - Process after block elements but before text
      // This allows it to work as an inline element within bold/italic
      // Pattern captures any content including nested HTML from bold/italic
      pattern: /<(cb|cg|cl|cj|cy|co|cr|cp|ca|cd|cc|cf|cs|c_)>((?:(?!<\/c>).)+)<\/c>/gs,
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
