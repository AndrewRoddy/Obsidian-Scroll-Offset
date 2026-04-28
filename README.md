# Cursor Scroll Offset

An [Obsidian](https://obsidian.md) plugin that keeps your cursor a fixed number of visual rows away from the top and bottom edges of the editor as you navigate, similar to Vim's `scrolloff` option.

## Features

- Maintains a configurable scroll offset above and below the cursor while navigating
- Works with Vim mode (`j`/`k`) and standard arrow key navigation
- Offset is measured in visual rows, not document lines, so wrapped lines are handled correctly
- Configurable row count via the plugin settings page (default: 8)

## Installation

This plugin is not currently listed in the Obsidian community plugin browser and must be installed manually.

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/AndrewRoddy/Obsidian-Cursor-Scrolloff/releases)
2. Create a folder at `<your vault>/.obsidian/plugins/cursor-scrolloff/`
3. Place both files inside that folder
4. Open Obsidian, go to Settings > Community Plugins, and enable the plugin

## Usage

Once enabled, the plugin works automatically. As you move the cursor up or down using arrow keys or Vim `j`/`k`, the editor will scroll to keep the cursor at least the configured number of visual rows from the edge of the screen.

## Settings

Open Settings > Community Plugins > Cursor Scroll Offset to configure:

| Setting | Description | Default |
|---|---|---|
| Scroll offset rows | Number of visual rows to keep between the cursor and the screen edge | 8 |

## Contributing

Pull requests are welcome on the [GitHub repository](https://github.com/AndrewRoddy/Obsidian-Cursor-Scrolloff). If you find a bug or want to suggest a feature, please open an issue first.
