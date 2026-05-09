'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HighlightPopoverProps {
  textarea: HTMLTextAreaElement;
  onClose: () => void;
}

const COLOR_PRESETS = [
  { name: 'Yellow', value: 'yellow', color: 'bg-yellow-200/70' },
  { name: 'Green', value: 'green', color: 'bg-green-200/70' },
  { name: 'Blue', value: 'blue', color: 'bg-blue-200/70' },
  { name: 'Red', value: 'red', color: 'bg-red-200/70' },
  { name: 'Purple', value: 'purple', color: 'bg-purple-200/70' },
  { name: 'Pink', value: 'pink', color: 'bg-pink-200/70' },
  { name: 'Orange', value: 'orange', color: 'bg-orange-200/70' },
];

export function HighlightPopover({ textarea, onClose }: HighlightPopoverProps) {
  const [selectedColor, setSelectedColor] = useState('yellow');
  const [customColor, setCustomColor] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const insertHighlight = () => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const placeholder = selectedText || 'highlighted text';

    let syntax = '';
    if (useCustom && customColor) {
      // Hex color format
      syntax = `=={${customColor}}${placeholder}==`;
    } else if (selectedColor === 'yellow') {
      // Default yellow (no color specified)
      syntax = `==${placeholder}==`;
    } else {
      // Named color
      syntax = `=={${selectedColor}}${placeholder}==`;
    }

    // Insert the highlight syntax
    const newText =
      textarea.value.substring(0, start) +
      syntax +
      textarea.value.substring(end);

    textarea.value = newText;

    // Set cursor position after the inserted text
    const newCursorPos = start + syntax.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);

    // Trigger input event so React detects the change
    textarea.dispatchEvent(new Event('input', { bubbles: true }));

    onClose();
  };

  return (
    <div className="w-80 p-4 space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Highlight Color</h3>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color.value}
              onClick={() => {
                setSelectedColor(color.value);
                setUseCustom(false);
              }}
              className={`relative h-12 rounded-md border-2 transition-all ${
                selectedColor === color.value && !useCustom
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border hover:border-primary/50'
              } ${color.color}`}
              title={color.name}
            >
              <span className="sr-only">{color.name}</span>
              {selectedColor === color.value && !useCustom && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                    ✓
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t">
        <Label htmlFor="custom-color" className="text-sm font-medium mb-2 block">
          Custom Hex Color
        </Label>
        <div className="flex gap-2">
          <Input
            id="custom-color"
            type="text"
            placeholder="#ff6b6b"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              if (e.target.value.startsWith('#')) {
                setUseCustom(true);
              }
            }}
            onFocus={() => setUseCustom(true)}
            className="flex-1"
          />
          {customColor && (
            <div
              className="w-12 h-10 rounded border-2 border-border"
              style={{ backgroundColor: customColor }}
              title={customColor}
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Enter a hex color code (e.g., #ff6b6b)
        </p>
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={insertHighlight} className="flex-1">
          Insert Highlight
        </Button>
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
      </div>
    </div>
  );
}
