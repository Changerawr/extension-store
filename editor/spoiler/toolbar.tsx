import type { ExtensionToolbar } from '@/lib/services/core/markdown/extensions';

/**
 * Toolbar configuration for the Spoiler extension
 *
 * This adds a spoiler button to the editor toolbar that inserts
 * spoiler block syntax at the cursor position
 */
export const spoilerToolbar: ExtensionToolbar = {
  buttons: [
    {
      id: 'spoiler',
      icon: 'Eye', // Lucide icon name
      tooltip: 'Insert Spoiler Block',
      group: 'blocks',
      onClick: (textarea: HTMLTextAreaElement) => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const content = selectedText || 'Hidden content goes here';

        const spoilerBlock = `:::spoiler\n${content}\n:::`;

        // Insert the spoiler block
        textarea.value =
          textarea.value.substring(0, start) +
          spoilerBlock +
          textarea.value.substring(end);

        // Set cursor position
        const newCursorPos = selectedText
          ? start + spoilerBlock.length
          : start + ':::spoiler\n'.length;

        textarea.selectionStart = newCursorPos;
        textarea.selectionEnd = newCursorPos;
        textarea.focus();

        // Trigger input event so React state updates
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      },
    },
  ],
};
