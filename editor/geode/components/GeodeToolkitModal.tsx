'use client';

import { useState } from 'react';
import type { ModalComponentProps } from '@changerawr/markdown';

const COLORS = [
  { tag: 'cb', name: 'Blue', hex: '#4A52E1' },
  { tag: 'cg', name: 'Green', hex: '#40E348' },
  { tag: 'cl', name: 'Light Blue', hex: '#60ABEF' },
  { tag: 'cj', name: 'Cyan', hex: '#32C8FF' },
  { tag: 'cy', name: 'Yellow', hex: '#FFFF00' },
  { tag: 'co', name: 'Orange', hex: '#FF5A4B' },
  { tag: 'cr', name: 'Red', hex: '#FF5A5A' },
  { tag: 'cp', name: 'Pink', hex: '#FF00FF' },
  { tag: 'ca', name: 'Purple', hex: '#9632FF' },
  { tag: 'cd', name: 'Light Pink', hex: '#FF96FF' },
  { tag: 'cc', name: 'Light Yellow', hex: '#FFFF96' },
  { tag: 'cf', name: 'Light Cyan', hex: '#96FFFF' },
  { tag: 'cs', name: 'Gold', hex: '#FFDC41' },
  { tag: 'c_', name: 'Bright Red', hex: '#FF0000' },
];

const BADGES = [
  { id: 'version', label: 'Version', example: 'v1.2.3' },
  { id: 'downloads', label: 'Downloads', example: '1.2k downloads' },
  { id: 'gd', label: 'GD Version', example: 'GD 2.206' },
  { id: 'geode', label: 'Geode Version', example: 'Geode v3.0.0' },
];

type Tab = 'colors' | 'links' | 'badges';

export function GeodeToolkitModal({ onInsert, onClose }: ModalComponentProps) {
  const [activeTab, setActiveTab] = useState<Tab>('colors');

  // Color tab state
  const [selectedColor, setSelectedColor] = useState('cb');
  const [colorText, setColorText] = useState('');

  // Links tab state
  const [linkType, setLinkType] = useState<'user' | 'level' | 'mod'>('user');
  const [linkValue, setLinkValue] = useState('');
  const [linkText, setLinkText] = useState('');

  // Badges tab state
  const [modId, setModId] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<Set<string>>(new Set());

  const handleInsertColor = () => {
    if (!colorText.trim()) return;
    onInsert(`<${selectedColor}>${colorText}</${selectedColor}>`);
    setColorText('');
    onClose();
  };

  const handleInsertLink = () => {
    if (!linkValue.trim()) return;
    const text = linkText.trim() || linkValue;
    onInsert(`[${text}](${linkType}:${linkValue})`);
    setLinkValue('');
    setLinkText('');
    onClose();
  };

  const handleInsertBadges = () => {
    if (!modId.trim() || selectedBadges.size === 0) return;
    const badgeMarkdown = Array.from(selectedBadges)
      .map(badge => `![${badge}](https://api.geode-sdk.org/v1/mods/${modId}/badges/${badge})`)
      .join(' ');
    onInsert(badgeMarkdown);
    setModId('');
    setSelectedBadges(new Set());
    onClose();
  };

  const toggleBadge = (badgeId: string) => {
    setSelectedBadges(prev => {
      const newSet = new Set(prev);
      if (newSet.has(badgeId)) {
        newSet.delete(badgeId);
      } else {
        newSet.add(badgeId);
      }
      return newSet;
    });
  };

  const getLinkPreview = () => {
    if (!linkValue.trim()) return '';
    const protocols: Record<typeof linkType, string> = {
      user: 'https://gdbrowser.com/u/',
      level: 'https://gdbrowser.com/',
      mod: 'https://geode-sdk.org/mods/',
    };
    return protocols[linkType] + linkValue;
  };

  return (
    <div className="w-full max-w-3xl flex flex-col h-[600px]">
      {/* Header with Tabs */}
      <div className="px-6 pt-6 pb-0 shrink-0">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-1">GeodeMD Toolkit</h2>
          <p className="text-sm text-muted-foreground">
            Add Geometry Dash formatting, links, and badges to your markdown
          </p>
        </div>

        <div className="flex gap-1 border-b">
          <button
            onClick={() => setActiveTab('colors')}
            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
              activeTab === 'colors'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Color Tags
            {activeTab === 'colors' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
              activeTab === 'links'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            GD Links
            {activeTab === 'links' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
              activeTab === 'badges'
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Geode Badges
            {activeTab === 'badges' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Tab Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Select Color</label>
              <div className="grid grid-cols-7 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.tag}
                    onClick={() => setSelectedColor(color.tag)}
                    className={`
                      relative h-14 rounded-lg border-2 transition-all shadow-sm hover:shadow-md
                      ${selectedColor === color.tag
                        ? 'border-primary ring-2 ring-primary/20 scale-105'
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.tag && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-white border-2 border-black shadow-lg" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-3 text-sm">
                <span className="text-muted-foreground">Selected: </span>
                <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">&lt;{selectedColor}&gt;</code>
                <span className="ml-2 font-medium" style={{ color: COLORS.find(c => c.tag === selectedColor)?.hex }}>
                  {COLORS.find(c => c.tag === selectedColor)?.name}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Text to Color</label>
              <input
                type="text"
                value={colorText}
                onChange={(e) => setColorText(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && colorText.trim()) {
                    handleInsertColor();
                  }
                }}
              />
            </div>

            {colorText && (
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="text-xs font-medium text-muted-foreground mb-2">Live Preview:</div>
                <div className="text-lg font-semibold mb-3" style={{ color: COLORS.find(c => c.tag === selectedColor)?.hex }}>
                  {colorText}
                </div>
                <div className="text-xs text-muted-foreground font-mono bg-background/50 p-2 rounded">
                  &lt;{selectedColor}&gt;{colorText}&lt;/{selectedColor}&gt;
                </div>
              </div>
            )}
          </div>
        )}

        {/* Links Tab */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Link Type</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'user' as const, label: 'GD User', desc: 'Link to a GD profile' },
                  { type: 'level' as const, label: 'GD Level', desc: 'Link to a GD level' },
                  { type: 'mod' as const, label: 'Geode Mod', desc: 'Link to a Geode mod' },
                ].map(({ type, label, desc }) => (
                  <button
                    key={type}
                    onClick={() => setLinkType(type)}
                    className={`
                      p-4 rounded-lg border-2 transition-all text-left
                      ${linkType === type
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-muted/30'
                      }
                    `}
                  >
                    <div className="font-medium text-sm mb-1">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {linkType === 'user' ? 'Username' : linkType === 'level' ? 'Level ID' : 'Mod ID'}
              </label>
              <input
                type="text"
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value)}
                placeholder={linkType === 'user' ? 'RobTop' : linkType === 'level' ? '10565740' : 'geode.loader'}
                className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Link Text (Optional)</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Leave empty to use the ID/username"
                className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && linkValue.trim()) {
                    handleInsertLink();
                  }
                }}
              />
            </div>

            {linkValue && (
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="text-xs font-medium text-muted-foreground mb-2">Link Preview:</div>
                <div className="mb-3">
                  <a
                    href={getLinkPreview()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    {linkText || linkValue}
                  </a>
                </div>
                <div className="text-xs text-muted-foreground font-mono bg-background/50 p-2 rounded mb-2">
                  [{linkText || linkValue}]({linkType}:{linkValue})
                </div>
                <div className="text-xs text-muted-foreground">
                  → {getLinkPreview()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Geode Mod ID</label>
              <input
                type="text"
                value={modId}
                onChange={(e) => setModId(e.target.value)}
                placeholder="e.g., geode.loader or username.modname"
                className="w-full px-3 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Enter the mod ID from the Geode SDK to generate status badges
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Select Badges</label>
              <div className="grid grid-cols-2 gap-3">
                {BADGES.map((badge) => {
                  const isSelected = selectedBadges.has(badge.id);
                  return (
                    <button
                      key={badge.id}
                      onClick={() => toggleBadge(badge.id)}
                      className={`
                        p-4 rounded-lg border-2 transition-all text-left
                        ${isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50 hover:bg-muted/30'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-sm">{badge.label}</div>
                        {isSelected && (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{badge.example}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {modId && selectedBadges.size > 0 && (
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="text-xs font-medium text-muted-foreground mb-3">Selected Badges Preview:</div>
                <div className="space-y-2">
                  {Array.from(selectedBadges).map(badgeId => (
                    <div key={badgeId} className="text-xs font-mono bg-background/50 p-2 rounded">
                      ![{badgeId}](https://api.geode-sdk.org/v1/mods/{modId}/badges/{badgeId})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center gap-3 px-6 py-4 border-t bg-muted/20 shrink-0">
        <div className="text-xs text-muted-foreground">
          {activeTab === 'colors' && 'Press Enter to insert'}
          {activeTab === 'links' && 'Create clickable links to GD content'}
          {activeTab === 'badges' && `${selectedBadges.size} badge${selectedBadges.size !== 1 ? 's' : ''} selected`}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-input hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={
              activeTab === 'colors'
                ? handleInsertColor
                : activeTab === 'links'
                ? handleInsertLink
                : handleInsertBadges
            }
            disabled={
              (activeTab === 'colors' && !colorText.trim()) ||
              (activeTab === 'links' && !linkValue.trim()) ||
              (activeTab === 'badges' && (!modId.trim() || selectedBadges.size === 0))
            }
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activeTab === 'colors' && 'Insert Color Tag'}
            {activeTab === 'links' && 'Insert Link'}
            {activeTab === 'badges' && 'Insert Badges'}
          </button>
        </div>
      </div>
    </div>
  );
}
