# Spoiler Block Extension

Add collapsible spoiler blocks with customizable titles and color schemes. Perfect for hiding plot details, quiz answers, or sensitive information.

## Syntax

### Basic Spoiler
```markdown
:::spoiler
Hidden content goes here
:::
```

### Custom Title
```markdown
:::spoiler Plot Twist Alert!
The butler did it!
:::
```

### Colored Spoiler with Title
```markdown
:::spoiler{red} Warning: Spoilers Ahead
Major plot details revealed here!
:::
```

### Hex Color Support
```markdown
:::spoiler{#ff6b6b} Custom Color
Use any hex color for fully custom themes!
:::
```

### Custom Icon (New!)
```markdown
:::spoiler{red}[🚨] Critical Alert
You can set any emoji as the icon!
:::

:::spoiler[🎉] Party Time
Even without a color, you can customize the icon!
:::

:::spoiler{#9b59b6}[🌟] Custom Everything
Combine hex colors with custom icons!
:::
```

## Color Schemes

Available colors with their icons:
- `default` 🔒 - Gray/blue (default)
- `red` ⚠️ - Red theme (warnings, major spoilers)
- `yellow` 💡 - Yellow theme (tips, hints)
- `green` ✅ - Green theme (solutions, answers)
- `blue` ℹ️ - Blue theme (information)
- `purple` 🔮 - Purple theme (mystery, secrets)
- **Any hex code** 🎨 - Custom colors (e.g., `#ff6b6b`, `#4a90e2`, `#9b59b6`)

## Features

- **Nested Markdown Support**: Use any markdown inside spoilers (bold, italic, lists, code, links, etc.)
- **Customizable Titles**: Set your own summary text
- **Color Schemes**: 6 built-in color themes with distinct icons
- **Hex Color Support**: Use any custom hex color (e.g., `#ff6b6b`)
- **Custom Icons**: Override the default icon with any emoji (e.g., `[🚨]`, `[🎉]`, `[🌟]`)
- **Smooth Animations**: Arrow rotates 90° when opening/closing
- **Dark Mode**: All colors have dark mode variants
- **Accessibility**: Proper semantic HTML with `<details>` and `<summary>`

## Examples

```markdown
:::spoiler
This is a basic spoiler with **bold text** and *italic*.
:::

:::spoiler Quiz Answer
The answer is: 42
:::

:::spoiler{red} Major Plot Spoiler
In the final episode, the main character reveals they were a ghost all along.
:::

:::spoiler{green} Solution
To solve this problem:
1. First, identify the variables
2. Apply the formula
3. Simplify the result
:::

:::spoiler{yellow} Pro Tip
You can nest **any markdown** including:
- Lists like this one
- [Links](https://example.com)
- `code snippets`
- And more!
:::

:::spoiler{red}[🚨] Critical Warning
Custom icon examples with colors!
:::

:::spoiler[🎉] Celebration
Custom icon without a color theme.
:::

:::spoiler{#9b59b6}[🌟] Premium Feature
Combine custom hex colors with custom icons for ultimate customization!
:::
```

## Toolbar Button

The extension adds an Eye icon button to the blocks toolbar section that wraps selected text in spoiler syntax.
