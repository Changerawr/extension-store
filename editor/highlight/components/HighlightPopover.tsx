'use client';

import { useState, useRef } from 'react';

interface HighlightPopoverProps {
  textarea: HTMLTextAreaElement;
  onClose: () => void;
}

const COLOR_PRESETS = [
  { name: 'Yellow', value: '#fef08a', color: '#fef08a' },
  { name: 'Green', value: '#bbf7d0', color: '#bbf7d0' },
  { name: 'Blue', value: '#bfdbfe', color: '#bfdbfe' },
  { name: 'Red', value: '#fecaca', color: '#fecaca' },
  { name: 'Purple', value: '#e9d5ff', color: '#e9d5ff' },
  { name: 'Pink', value: '#fbcfe8', color: '#fbcfe8' },
  { name: 'Orange', value: '#fed7aa', color: '#fed7aa' },
];

export function HighlightPopover({ textarea, onClose }: HighlightPopoverProps) {
  const [selectedColor, setSelectedColor] = useState('#fef08a');
  const [customColor, setCustomColor] = useState('#ff6b6b');
  const [isPickingCustomColor, setIsPickingCustomColor] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const insertHighlight = (color?: string) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const placeholder = selectedText || 'highlighted text';

    const colorToUse = color || selectedColor;
    let syntax = '';

    if (colorToUse === 'custom') {
      syntax = `=={${customColor}}${placeholder}==`;
    } else if (colorToUse === '#fef08a') {
      // Default yellow - no braces needed
      syntax = `==${placeholder}==`;
    } else {
      // Any other hex color
      syntax = `=={${colorToUse}}${placeholder}==`;
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

  const handleCustomColorClick = () => {
    setIsPickingCustomColor(true);
    setSelectedColor('custom');
    // Open native color picker
    colorInputRef.current?.click();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Just update the color preview, don't insert yet
    setCustomColor(e.target.value);
  };

  const handleApplyCustomColor = () => {
    insertHighlight('custom');
  };

  return (
    <div className="p-3 space-y-2">
      <div className="grid grid-cols-4 gap-1.5">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => {
              setSelectedColor(preset.value);
              setIsPickingCustomColor(false);
              insertHighlight(preset.value);
            }}
            className={`relative h-10 rounded border-2 transition-all ${
              selectedColor === preset.value && !isPickingCustomColor
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            }`}
            style={{ backgroundColor: preset.color }}
            title={preset.name}
          >
            <span className="sr-only">{preset.name}</span>
          </button>
        ))}

        {/* Custom color picker - 8th option */}
        <button
          onClick={handleCustomColorClick}
          className={`relative h-10 rounded border-2 transition-all ${
            isPickingCustomColor
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border hover:border-primary/50'
          }`}
          style={{
            background: isPickingCustomColor
              ? customColor
              : 'linear-gradient(135deg, #ff0000 0%, #ff7f00 12.5%, #ffff00 25%, #00ff00 37.5%, #0000ff 50%, #4b0082 62.5%, #9400d3 75%, #ff0000 100%)'
          }}
          title="Custom Color"
        >
          <span className="sr-only">Custom Color</span>
          {/* Hidden native color input */}
          <input
            ref={colorInputRef}
            type="color"
            value={customColor}
            onChange={handleColorChange}
            className="absolute opacity-0 w-0 h-0"
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Apply button when browsing custom colors */}
      {isPickingCustomColor && (
        <div className="pt-1 border-t">
          <button
            onClick={handleApplyCustomColor}
            className="w-full px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded transition-colors"
          >
            Apply {customColor}
          </button>
        </div>
      )}
    </div>
  );
}
