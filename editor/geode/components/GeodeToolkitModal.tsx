'use client';

import { useState } from 'react';

interface GeodeModalProps {
  textarea?: HTMLTextAreaElement;
  onClose: () => void;
}

const BADGE_OPTIONS = [
  { id: 'version', label: 'Version' },
  { id: 'downloads', label: 'Downloads' },
  { id: 'gd_version', label: 'GD Version' },
  { id: 'geode_version', label: 'Geode Version' },
] as const;

const BADGE_LABELS: Record<string, string> = Object.fromEntries(
  BADGE_OPTIONS.map(({ id, label }) => [id, label])
);

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

export function GeodeToolkitModal({ textarea, onClose }: GeodeModalProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'links' | 'badges'>('colors');
  const [selectedColor, setSelectedColor] = useState('cb');
  const [colorText, setColorText] = useState('');
  const [linkType, setLinkType] = useState<'user' | 'level' | 'mod'>('user');
  const [linkValue, setLinkValue] = useState('');
  const [linkText, setLinkText] = useState('');
  const [modId, setModId] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<Set<string>>(new Set());

  const insertMarkdown = (markdown: string) => {
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    textarea.value = text.substring(0, start) + markdown + text.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + markdown.length;
    const event = new Event('input', { bubbles: true });
    textarea.dispatchEvent(event);
    onClose();
  };

  const handleColorInsert = () => {
    if (colorText.trim()) {
      insertMarkdown(`<${selectedColor}>${colorText}</c>`);
    }
  };

  const handleLinkInsert = () => {
    if (linkValue.trim()) {
      insertMarkdown(`[${linkText || linkValue}](${linkType}:${linkValue})`);
    }
  };

  const handleBadgesInsert = () => {
    if (modId.trim() && selectedBadges.size > 0) {
      const badges = Array.from(selectedBadges)
        .map(stat => `![${BADGE_LABELS[stat]}](https://api.geode-sdk.org/v1/mods/${modId}/status_badge?stat=${stat})`)
        .join(' ');
      insertMarkdown(badges);
    }
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(85vh - 120px)' }}>
      {/* Tabs */}
      <div className="flex border-b mb-6">
        {[
          { id: 'colors' as const, label: 'Colors' },
          { id: 'links' as const, label: 'Links' },
          { id: 'badges' as const, label: 'Badges' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Choose Color</label>
              <div className="grid grid-cols-7 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.tag}
                    onClick={() => setSelectedColor(color.tag)}
                    className={`h-12 rounded-lg border-2 transition-all ${
                      selectedColor === color.tag
                        ? 'border-foreground scale-105 shadow-lg'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} (${color.tag})`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Text</label>
              <input
                type="text"
                value={colorText}
                onChange={(e) => setColorText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleColorInsert()}
                placeholder="Enter text..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>

            {colorText && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Preview</p>
                <p className="text-lg font-semibold" style={{ color: COLORS.find(c => c.tag === selectedColor)?.hex }}>
                  {colorText}
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  &lt;{selectedColor}&gt;{colorText}&lt;/c&gt;
                </p>
              </div>
            )}

            <button
              onClick={handleColorInsert}
              disabled={!colorText.trim()}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              Insert Color Tag
            </button>
          </div>
        )}

        {/* Links Tab */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Link Type</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'user' as const, label: 'GD User', example: 'RobTop' },
                  { type: 'level' as const, label: 'GD Level', example: '10565740' },
                  { type: 'mod' as const, label: 'Geode Mod', example: 'geode.loader' },
                ].map(({ type, label, example }) => (
                  <button
                    key={type}
                    onClick={() => setLinkType(type)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      linkType === type
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{example}</div>
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Link Text (Optional)</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLinkInsert()}
                placeholder="Leave empty to use ID/username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {linkValue && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Preview</p>
                <p className="text-sm text-primary font-medium">{linkText || linkValue}</p>
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  [{linkText || linkValue}]({linkType}:{linkValue})
                </p>
              </div>
            )}

            <button
              onClick={handleLinkInsert}
              disabled={!linkValue.trim()}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              Insert Link
            </button>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Mod ID</label>
              <input
                type="text"
                value={modId}
                onChange={(e) => setModId(e.target.value)}
                placeholder="e.g., geode.loader"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Select Badges</label>
              <div className="grid grid-cols-2 gap-3">
                {BADGE_OPTIONS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => {
                      const newSet = new Set(selectedBadges);
                      if (newSet.has(id)) newSet.delete(id);
                      else newSet.add(id);
                      setSelectedBadges(newSet);
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedBadges.has(id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium text-sm">{label}</div>
                    {selectedBadges.has(id) && (
                      <div className="text-xs text-primary mt-1">✓ Selected</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {modId && selectedBadges.size > 0 && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">
                  {selectedBadges.size} badge{selectedBadges.size !== 1 ? 's' : ''} selected
                </p>
                <div className="space-y-1">
                  {Array.from(selectedBadges).map(stat => (
                    <p key={stat} className="text-xs font-mono text-muted-foreground break-all">
                      ![{BADGE_LABELS[stat]}](https://api.geode-sdk.org/v1/mods/{modId}/status_badge?stat={stat})
                    </p>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleBadgesInsert}
              disabled={!modId.trim() || selectedBadges.size === 0}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              Insert Badges
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
