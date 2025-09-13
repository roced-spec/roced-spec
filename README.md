# Portfolio Website - Minimal Configuration

This portfolio website is now managed entirely through a single JSON configuration file with minimal JavaScript code.

## Structure

```
├── index.html          # Main HTML file (minimal)
├── config.json         # Single source of truth for all content and structure
├── js/
│   └── app.js          # Single JavaScript file handling everything
├── css/                # Existing CSS files (unchanged)
└── backup/             # Backup of old modular structure
```

## Key Features

- **Single Configuration**: Everything managed from `config.json`
- **Synchronized Navigation**: Menu items and sections automatically synchronized
- **Minimal Code**: One JavaScript file handles all functionality
- **Static Approach**: Template-based rendering with minimal dynamic behavior
- **Easy Maintenance**: Change content, order, or structure by editing JSON only

## Configuration

### Adding/Removing Sections
Edit the `navigation` array in `config.json`:
```json
"navigation": [
  { "id": "home", "label": "Home" },
  { "id": "about", "label": "About" }
]
```

### Reordering Sections
Simply reorder items in the `navigation` array - both menu and page sections will update automatically.

### Updating Content
Modify the corresponding section data in the `sections` object:
```json
"sections": {
  "home": {
    "type": "hero",
    "data": { ... }
  }
}
```

### Adding Themes
Add theme names to the `themes` array:
```json
"themes": ["github", "dracula", "custom-theme"]
```

## Section Types

- `hero`: Landing section with name, title, and code block
- `about`: Bio text with stats
- `timeline`: Experience/timeline items
- `grid`: Projects or skills in grid layout
- `contact`: Contact information with social links

## Benefits

1. **Maintainability**: Single file to update all content
2. **Consistency**: Navigation and sections always synchronized
3. **Performance**: Minimal JavaScript footprint
4. **Simplicity**: No complex component loading or state management
5. **Flexibility**: Easy to add new section types or modify existing ones
