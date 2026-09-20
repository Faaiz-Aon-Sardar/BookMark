# ⚡ Bookmark Launcher

A fast, responsive web and desktop launcher for your favorite websites, tools, and developer resources. Built with React 19, TypeScript, Tailwind CSS, and Tauri 2.

![Bookmark Launcher](public/icon-512.svg)

---

## ✨ Features

- **🚀 Instant Omni-Search**: Search saved bookmarks, discover real websites via live Google Suggest & web engine resolution with official domain icons.
- **📌 1-Click Bookmarking**: Auto-detects domain names, favicons, high-resolution logos, and metadata.
- **🗂️ Custom Color-Coded Lists**: Organize bookmarks into custom named collections with custom icons and color themes.
- **🏷️ Tagging & Category Filters**: Quickly filter bookmarks by hashtags (e.g. `#Development`, `#AI`, `#Tools`, `#Media`).
- **❤️ Favorites Section**: Pin high-frequency websites directly to the top grid.
- **🌓 Dark & Light Modes**: High-contrast theme system with system preference detection and manual toggle.
- **💾 Auto-Save & JSON Export/Import**: Automatic `localStorage` persistence with complete JSON backup and restore support.
- **💻 Desktop App & PWA Ready**: Installable directly from your browser title bar (Chrome / Edge PWA) or packageable as a standalone Windows `.exe` / `.msi` via Tauri 2.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>Cmd</kbd> + <kbd>K</kbd> | Focus Search Bar |
| <kbd>Ctrl</kbd> + <kbd>N</kbd> / <kbd>Cmd</kbd> + <kbd>N</kbd> | Open "Add Bookmark" Modal |
| <kbd>Enter</kbd> or <kbd>Space</kbd> | Launch Selected Bookmark |
| <kbd>Esc</kbd> | Close Any Open Modal or Menu |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **Build Tool**: Vite 6
- **Desktop Runtime**: Tauri 2 / Progressive Web App (PWA)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/bookmark-launcher.git

# Navigate to project directory
cd bookmark-launcher

# Install dependencies
npm install

# Start local development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 📦 Production Build

```bash
# Type check and build optimized web assets
npm run build

# Preview production build locally
npm run preview
```

---

## 🖥️ Packaging as Windows Native Desktop App (`.exe`)

```bash
# Run in Tauri desktop development mode
npm run tauri:dev

# Build standalone Windows installer (.exe / .msi)
npm run tauri:build
```

---

## 📄 License

Apache-2.0 License.
