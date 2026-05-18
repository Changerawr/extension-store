'use client';

import { useState } from 'react';
import type { ModalComponentProps } from '@changerawr/markdown';

interface Badge {
    id: string;
    name: string;
    stat: string;
    description: string;
}

const BADGES: Badge[] = [
    { id: 'version', name: 'Mod Version', stat: 'version', description: 'Display your mod\'s current version' },
    { id: 'downloads', name: 'Downloads', stat: 'downloads', description: 'Show total download count' },
    { id: 'gd-version', name: 'GD Version', stat: 'gd_version', description: 'Supported Geometry Dash version' },
    { id: 'geode-version', name: 'Geode Version', stat: 'geode_version', description: 'Required Geode version' }
];

const COLORS = [
    { tag: 'cb', name: 'Blue', color: '#4A52E1' },
    { tag: 'cg', name: 'Green', color: '#40E348' },
    { tag: 'cl', name: 'Light Blue', color: '#60ABEF' },
    { tag: 'cj', name: 'Cyan', color: '#32C8FF' },
    { tag: 'cy', name: 'Yellow', color: '#FFFF00' },
    { tag: 'co', name: 'Orange', color: '#FF5A4B' },
    { tag: 'cr', name: 'Red', color: '#FF5A5A' },
    { tag: 'cp', name: 'Pink', color: '#FF00FF' },
    { tag: 'ca', name: 'Purple', color: '#9632FF' },
    { tag: 'cd', name: 'Light Pink', color: '#FF96FF' },
    { tag: 'cc', name: 'Light Yellow', color: '#FFFF96' },
    { tag: 'cf', name: 'Light Cyan', color: '#96FFFF' },
    { tag: 'cs', name: 'Gold', color: '#FFDC41' },
    { tag: 'c_', name: 'Bright Red', color: '#FF0000' }
];

const LINK_TYPES = [
    { id: 'user', name: 'GD Account', protocol: 'user', placeholder: '12345', description: 'Link to a Geometry Dash account' },
    { id: 'level', name: 'GD Level', protocol: 'level', placeholder: '67890', description: 'Link to a Geometry Dash level' },
    { id: 'mod', name: 'Geode Mod', protocol: 'mod', placeholder: 'com.example.mod', description: 'Link to a Geode mod' }
];

export function GeodeToolkitModal({ onInsert, onClose }: ModalComponentProps) {
    const [activeTab, setActiveTab] = useState<'badges' | 'links' | 'colors'>('badges');

    // Badge state
    const [modId, setModId] = useState('');
    const [selectedBadges, setSelectedBadges] = useState<Set<string>>(new Set());

    // Link state
    const [linkType, setLinkType] = useState('user');
    const [linkId, setLinkId] = useState('');
    const [linkText, setLinkText] = useState('');

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

    const handleInsertBadges = () => {
        if (!modId.trim() || selectedBadges.size === 0) return;

        const badgeMarkdown = Array.from(selectedBadges)
            .map(badgeId => {
                const badge = BADGES.find(b => b.id === badgeId);
                if (!badge) return '';
                return `![${badge.name}](https://api.geode-sdk.org/v1/mods/${modId}/status_badge?stat=${badge.stat})`;
            })
            .filter(Boolean)
            .join('\n');

        onInsert(badgeMarkdown);
        onClose();
    };

    const handleInsertLink = () => {
        if (!linkId.trim() || !linkText.trim()) return;

        const linkMarkdown = `[${linkText}](${linkType}:${linkId})`;
        onInsert(linkMarkdown);
        onClose();
    };

    const handleColorClick = (tag: string) => {
        const colorMarkdown = `<${tag}>text</c>`;
        onInsert(colorMarkdown);
        onClose();
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
                <h3 className="text-lg font-semibold mb-1">GeodeMD Toolkit</h3>
                <p className="text-sm text-muted-foreground">
                    Badges, links, and color tags for Geometry Dash content
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 px-6 border-b">
                <button
                    onClick={() => setActiveTab('badges')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        activeTab === 'badges'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Badges
                </button>
                <button
                    onClick={() => setActiveTab('links')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        activeTab === 'links'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Links
                </button>
                <button
                    onClick={() => setActiveTab('colors')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                        activeTab === 'colors'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Colors
                </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 max-h-[500px] overflow-y-auto">
                {activeTab === 'badges' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mod ID</label>
                            <input
                                type="text"
                                value={modId}
                                onChange={(e) => setModId(e.target.value)}
                                placeholder="com.example.mymod"
                                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select Badges</label>
                            <div className="space-y-2">
                                {BADGES.map(badge => (
                                    <label
                                        key={badge.id}
                                        className="flex items-start gap-3 p-3 border border-input rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedBadges.has(badge.id)}
                                            onChange={() => toggleBadge(badge.id)}
                                            className="mt-0.5 w-4 h-4 rounded border-input flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm">{badge.name}</div>
                                            <div className="text-xs text-muted-foreground">{badge.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'links' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Link Type</label>
                            <div className="space-y-2">
                                {LINK_TYPES.map(type => (
                                    <label
                                        key={type.id}
                                        className="flex items-start gap-3 p-3 border border-input rounded-md hover:bg-accent/50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="radio"
                                            name="linkType"
                                            checked={linkType === type.protocol}
                                            onChange={() => setLinkType(type.protocol)}
                                            className="mt-0.5 w-4 h-4 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm">{type.name}</div>
                                            <div className="text-xs text-muted-foreground">{type.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Link Text</label>
                            <input
                                type="text"
                                value={linkText}
                                onChange={(e) => setLinkText(e.target.value)}
                                placeholder="Click here"
                                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                {linkType === 'user' ? 'Account ID' : linkType === 'level' ? 'Level ID' : 'Mod ID'}
                            </label>
                            <input
                                type="text"
                                value={linkId}
                                onChange={(e) => setLinkId(e.target.value)}
                                placeholder={LINK_TYPES.find(t => t.protocol === linkType)?.placeholder}
                                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div className="text-xs text-muted-foreground bg-accent/30 p-3 rounded-md break-all">
                            Preview: <code className="bg-background px-2 py-0.5 rounded">[{linkText || 'text'}]({linkType}:{linkId || 'id'})</code>
                        </div>
                    </div>
                )}

                {activeTab === 'colors' && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Click a color to insert. Close with <code className="bg-accent px-1.5 py-0.5 rounded text-xs">&lt;/c&gt;</code>
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {COLORS.map(color => (
                                <button
                                    key={color.tag}
                                    onClick={() => handleColorClick(color.tag)}
                                    className="flex items-center gap-3 p-3 border border-input rounded-md hover:bg-accent/50 transition-colors text-left"
                                >
                                    <div
                                        className="w-6 h-6 rounded border border-border flex-shrink-0"
                                        style={{ backgroundColor: color.color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm truncate">{color.name}</div>
                                        <div className="text-xs text-muted-foreground font-mono">&lt;{color.tag}&gt;</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="text-xs text-muted-foreground bg-accent/30 p-3 rounded-md">
                            Example: <code className="bg-background px-2 py-0.5 rounded">&lt;cr&gt;red text&lt;/c&gt;</code>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-muted/30">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm rounded-md border border-input hover:bg-accent transition-colors"
                >
                    Cancel
                </button>
                {activeTab === 'badges' && (
                    <button
                        onClick={handleInsertBadges}
                        disabled={!modId.trim() || selectedBadges.size === 0}
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Insert {selectedBadges.size > 0 && `(${selectedBadges.size})`}
                    </button>
                )}
                {activeTab === 'links' && (
                    <button
                        onClick={handleInsertLink}
                        disabled={!linkId.trim() || !linkText.trim()}
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Insert Link
                    </button>
                )}
            </div>
        </div>
    );
}
