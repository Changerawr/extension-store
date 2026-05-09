'use client';

import { useState, useRef } from 'react';

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
  const [customColor, setCustomColor] = useState('#ff6b6b');
  const colorInputRef = useRef<HTMLInputElement>(null);

  const insertHighlight = (color?: string) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const placeholder = selectedText || 'highlighted text';

    const colorToUse = color || selectedColor;
    let syntax = '';

    if (colorToUse === 'custom') {
      // Custom hex color
      syntax = `=={${customColor}}${placeholder}==`;
    } else if (colorToUse === 'yellow') {
      // Default yellow (no color specified)
      syntax = `==${placeholder}==`;
    } else {
      // Named color
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
    // Open native color picker
    colorInputRef.current?.click();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    setSelectedColor('custom');
    insertHighlight('custom');
  };

  return (
    <div className="p-3">
      <div className="grid grid-cols-4 gap-1.5">
        {COLOR_PRESETS.map((color) => (
          <button
            key={color.value}
            onClick={() => {
              setSelectedColor(color.value);
              insertHighlight(color.value);
            }}
            className={`relative h-10 rounded border-2 transition-all ${
              selectedColor === color.value
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-primary/50'
            } ${color.color}`}
            title={color.name}
          >
            <span className="sr-only">{color.name}</span>
          </button>
        ))}

        {/* Custom color picker - 8th option */}
        <button
          onClick={handleCustomColorClick}
          className={`relative h-10 rounded border-2 transition-all ${
            selectedColor === 'custom'
              ? 'border-primary ring-2 ring-primary/20'
              : 'border-border hover:border-primary/50'
          }`}
          style={{
            background: 'linear-gradient(135deg, #ff0000 0%, #ff7f00 12.5%, #ffff00 25%, #00ff00 37.5%, #0000ff 50%, #4b0082 62.5%, #9400d3 75%, #ff0000 100%)'
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
    </div>
  );
}
