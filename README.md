<p align="center">
  <img src=".github/websketch-logo.png" alt="WebSketch" width="400">
</p>

# websketch-extension

[![CI - Build & Validate Extension](https://github.com/mcp-tool-shop-org/websketch-extension/actions/workflows/ci.yml/badge.svg)](https://github.com/mcp-tool-shop-org/websketch-extension/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Chrome extension to capture web pages as [WebSketch IR](https://github.com/mcp-tool-shop-org/websketch-ir).

## Getting Started

1. Build and load the extension (see [Installation](#installation))
2. Navigate to any web page and click the WebSketch icon
3. Click "Capture Current Page" -- the capture JSON is copied to clipboard
4. Validate: `websketch validate capture.json` or paste into the [demo](https://mcptoolshop.com)
5. Visualize: `websketch render capture.json` or use the demo's Tree/ASCII views

Configure limits via Settings (gear icon in popup). See the full [workflow guide](https://github.com/mcp-tool-shop-org/websketch-ir#getting-started).

## Features

- 🎯 One-click page capture
- 📋 Automatic clipboard copy
- 🌳 Full DOM tree capture with styles
- 📏 Element bounds and positioning
- ⚙️ Configurable limits (maxDepth, maxNodes, maxStringLength)
- ⚠️ Warning banners when capture is truncated
- ⚡ Fast, lightweight, no external dependencies

## Installation

### From Source (Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/mcp-tool-shop-org/websketch-extension.git
   cd websketch-extension
   ```

2. **Install dependencies**
   ```bash
   npm ci
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` directory

### Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store soon.

## Usage

1. **Navigate** to any web page
2. **Click** the WebSketch extension icon in your toolbar
3. **Click** "Capture Current Page"
4. **Copy** the capture data (automatically copied to clipboard)
5. **Use** the WebSketch IR data with other tools

## Development

### Prerequisites

- Node.js 18+
- npm
- Chrome or Edge browser

### Setup

```bash
# Install dependencies
npm ci

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run tests
npm test
```

### Build

```bash
# Production build
npm run build

# Development build with watch mode
npm run dev
```

The built extension will be in the `dist/` directory.

### Project Structure

```
websketch-extension/
├── src/
│   ├── content.ts         # Content script (captures pages)
│   ├── popup.ts           # Popup UI script
│   └── static/
│       ├── popup.html     # Popup HTML
│       └── icons/         # Extension icons
├── tests/
│   └── capture.test.ts    # Tests
├── build.js               # Build script
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### Scripts

```bash
npm run build           # Build for production
npm run dev             # Watch mode for development
npm run clean           # Remove dist/ directory
npm run typecheck       # Run TypeScript type checking
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm test                # Run tests in watch mode
npm run test:run        # Run tests once
npm run test:coverage   # Generate coverage report
npm run validate        # Run all checks (typecheck, lint, test, build)
```

### Adding Icons

Place icon files in `src/static/icons/`:
- `icon16.png` - 16x16 pixels
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

For development without icons, use `npm run build -- --allow-missing`.

### Testing

```bash
# Run tests in watch mode
npm test

# Run once
npm run test:run

# With coverage
npm run test:coverage
```

### Loading the Extension

1. Run `npm run build`
2. Open `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `dist/` folder from this project

For development with auto-rebuild:
```bash
npm run dev
```
Then reload the extension in Chrome after each build.

## WebSketch IR Format

The extension captures pages in the WebSketch IR format, which includes:

```json
{
  "root": {
    "type": "HTML",
    "id": "...",
    "classes": ["..."],
    "children": [...]
  },
  "metadata": {
    "url": "https://example.com",
    "title": "Page Title",
    "timestamp": "2026-01-29T...",
    "viewport": {
      "width": 1920,
      "height": 1080
    }
  }
}
```

## Troubleshooting

### Build Fails with Missing Assets

If you see errors about missing icons or HTML files:

```bash
# For development, allow missing assets
npm run build -- --allow-missing

# Or add the required files to src/static/
```

### Extension Not Loading

- Ensure `dist/manifest.json` exists
- Check for errors in `chrome://extensions/`
- Try rebuilding: `npm run clean && npm run build`

### Capture Not Working

- Check the browser console for errors
- Ensure you're on a normal webpage (not `chrome://` pages)
- Reload the extension after rebuilding

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Publishing

### To Chrome Web Store

1. Build the extension: `npm run build`
2. Create a ZIP: `cd dist && zip -r ../extension.zip .`
3. Upload to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

### Automated Publishing (CI)

Coming soon: automated publishing workflow.

## License

MIT - see [LICENSE](LICENSE) file for details.

## Links

- **WebSketch IR**: [github.com/mcp-tool-shop-org/websketch-ir](https://github.com/mcp-tool-shop-org/websketch-ir)
- **Issues**: [github.com/mcp-tool-shop-org/websketch-extension/issues](https://github.com/mcp-tool-shop-org/websketch-extension/issues)
- **Chrome Extensions Documentation**: [developer.chrome.com/docs/extensions](https://developer.chrome.com/docs/extensions)

## Support

For questions or issues, please open an issue on GitHub.
