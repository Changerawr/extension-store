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

export function GeodeToolkitModal({ onInsert, onClose }: ModalComponentProps) {
  const [selectedColor, setSelectedColor] = useState('cb');
  const [colorText, setColorText] = useState('');

  const handleInsertColor = () => {
    if (!colorText.trim()) return;
    onInsert(`<${selectedColor}>${colorText}</${selectedColor}>`);
    setColorText('');
    onClose();
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">GeodeMD Color Tags</h2>
          <p className="text-sm text-muted-foreground">
            Add Geometry Dash color formatting to your text
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Color</label>
            <div className="grid grid-cols-7 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.tag}
                  onClick={() => setSelectedColor(color.tag)}
                  className={`
                    relative h-12 rounded-md border-2 transition-all
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
                      <div className="w-3 h-3 rounded-full bg-white border-2 border-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-2 text-sm">
              <span className="text-muted-foreground">Selected: </span>
              <span className="font-mono font-medium">&lt;{selectedColor}&gt;</span>
              <span className="ml-2" style={{ color: COLORS.find(c => c.tag === selectedColor)?.hex }}>
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
              placeholder="Enter your text here"
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && colorText.trim()) {
                  handleInsertColor();
                }
              }}
            />
          </div>

          {colorText && (
            <div className="p-4 bg-muted/30 rounded-md">
              <div className="text-xs text-muted-foreground mb-2">Preview:</div>
              <div className="font-medium" style={{ color: COLORS.find(c => c.tag === selectedColor)?.hex }}>
                {colorText}
              </div>
              <div className="text-xs text-muted-foreground mt-2 font-mono">
                &lt;{selectedColor}&gt;{colorText}&lt;/{selectedColor}&gt;
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-muted/20">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm rounded-md border border-input hover:bg-accent transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleInsertColor}
          disabled={!colorText.trim()}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Insert Colored Text
        </button>
      </div>
    </div>
  );
}
