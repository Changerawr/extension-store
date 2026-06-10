'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

const LINK_TYPES = [
  { type: 'user', label: 'GD User', example: 'RobTop' },
  { type: 'level', label: 'GD Level', example: '10565740' },
  { type: 'mod', label: 'Geode Mod', example: 'geode.loader' },
] as const;

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

  const toggleBadge = (id: string) => {
    setSelectedBadges(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as typeof activeTab)}
      className="flex flex-col"
      style={{ height: 'calc(85vh - 120px)' }}
    >
      <TabsList variant="underlined" className="w-full shrink-0 justify-start mb-6">
        <TabsTrigger value="colors" variant="underlined" className="px-6 py-3">Colors</TabsTrigger>
        <TabsTrigger value="links" variant="underlined" className="px-6 py-3">Links</TabsTrigger>
        <TabsTrigger value="badges" variant="underlined" className="px-6 py-3">Badges</TabsTrigger>
      </TabsList>

      <div className="flex-1 overflow-y-auto">
        <TabsContent value="colors" className="mt-0 space-y-6">
          <div>
            <Label className="mb-3 block">Choose Color</Label>
            <div className="grid grid-cols-7 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.tag}
                  type="button"
                  onClick={() => setSelectedColor(color.tag)}
                  className={cn(
                    'h-12 rounded-lg border-2 transition-all',
                    selectedColor === color.tag
                      ? 'border-foreground scale-105 shadow-lg'
                      : 'border-transparent hover:scale-105'
                  )}
                  style={{ backgroundColor: color.hex }}
                  title={`${color.name} (${color.tag})`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="geode-color-text">Text</Label>
            <Input
              id="geode-color-text"
              value={colorText}
              onChange={(e) => setColorText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleColorInsert()}
              placeholder="Enter text..."
              autoFocus
            />
          </div>

          {colorText && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="mb-2 text-xs text-muted-foreground">Preview</p>
              <p className="text-lg font-semibold" style={{ color: COLORS.find(c => c.tag === selectedColor)?.hex }}>
                {colorText}
              </p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                &lt;{selectedColor}&gt;{colorText}&lt;/c&gt;
              </p>
            </div>
          )}

          <Button onClick={handleColorInsert} disabled={!colorText.trim()} className="w-full">
            Insert Color Tag
          </Button>
        </TabsContent>

        <TabsContent value="links" className="mt-0 space-y-6">
          <div>
            <Label className="mb-3 block">Link Type</Label>
            <div className="grid grid-cols-3 gap-3">
              {LINK_TYPES.map(({ type, label, example }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLinkType(type)}
                  className={cn(
                    'rounded-lg border-2 p-4 text-left transition-all',
                    linkType === type
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="text-sm font-medium">{label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{example}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="geode-link-value">
              {linkType === 'user' ? 'Username' : linkType === 'level' ? 'Level ID' : 'Mod ID'}
            </Label>
            <Input
              id="geode-link-value"
              value={linkValue}
              onChange={(e) => setLinkValue(e.target.value)}
              placeholder={linkType === 'user' ? 'RobTop' : linkType === 'level' ? '10565740' : 'geode.loader'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="geode-link-text">Link Text (Optional)</Label>
            <Input
              id="geode-link-text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLinkInsert()}
              placeholder="Leave empty to use ID/username"
            />
          </div>

          {linkValue && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="mb-2 text-xs text-muted-foreground">Preview</p>
              <p className="text-sm font-medium text-primary">{linkText || linkValue}</p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                [{linkText || linkValue}]({linkType}:{linkValue})
              </p>
            </div>
          )}

          <Button onClick={handleLinkInsert} disabled={!linkValue.trim()} className="w-full">
            Insert Link
          </Button>
        </TabsContent>

        <TabsContent value="badges" className="mt-0 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="geode-mod-id">Mod ID</Label>
            <Input
              id="geode-mod-id"
              value={modId}
              onChange={(e) => setModId(e.target.value)}
              placeholder="e.g., geode.loader"
            />
          </div>

          <div>
            <Label className="mb-3 block">Select Badges</Label>
            <div className="grid grid-cols-2 gap-3">
              {BADGE_OPTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleBadge(id)}
                  className={cn(
                    'rounded-lg border-2 p-4 text-left transition-all',
                    selectedBadges.has(id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="text-sm font-medium">{label}</div>
                  {selectedBadges.has(id) && (
                    <Badge variant="default" size="sm" className="mt-1.5">Selected</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {modId && selectedBadges.size > 0 && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="mb-2 text-xs text-muted-foreground">
                {selectedBadges.size} badge{selectedBadges.size !== 1 ? 's' : ''} selected
              </p>
              <div className="space-y-1">
                {Array.from(selectedBadges).map(stat => (
                  <p key={stat} className="break-all font-mono text-xs text-muted-foreground">
                    ![{BADGE_LABELS[stat]}](https://api.geode-sdk.org/v1/mods/{modId}/status_badge?stat={stat})
                  </p>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleBadgesInsert}
            disabled={!modId.trim() || selectedBadges.size === 0}
            className="w-full"
          >
            Insert Badges
          </Button>
        </TabsContent>
      </div>
    </Tabs>
  );
}
