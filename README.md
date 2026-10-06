# Link to QR Code Generator 🔗 ➡️ 📱

A modern, fast, and responsive **Link → QR Code Generator** web application built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

- **Link Input & Formatting**: Converts any URL or website domain into a scannable QR code.
- **Client-Side Generation**: Uses `qrcodejs` via CDN for instant, private, client-side rendering.
- **High-Resolution Download**: Export QR codes as clean PNG images with padded borders.
- **Copy Link with Feedback**: One-click clipboard copy with toast notifications.
- **Real-Time Validation**: Clear error feedback for empty or invalid link formats.
- **Modern UI**: Frosted glassmorphism card, ambient background glow, and responsive mobile-first layout.

## 🚀 Getting Started

No build tools or backend dependencies are required.

Simply open `index.html` in your browser or run a simple local web server:

```bash
# Using Python 3
python3 -m http.server 3000
```

Then visit `http://localhost:3000`.

## 📁 Project Structure

```
link_to_QR/
├── index.html     # Semantic UI layout and CDN imports
├── style.css      # Design system, glassmorphism, animations
├── script.js      # QR code generation, validation, and actions
└── README.md      # Documentation
```

## 📄 License

MIT
