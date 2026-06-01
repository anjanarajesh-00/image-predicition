# image-predicition
# 🧠 Image Prediction API

A browser-based image analysis tool powered by Claude's vision model. Upload any image and get AI-generated labels, confidence scores, scene descriptions, and metadata — no backend required.

## ✨ Features

- **Label detection** — 5–8 relevant labels with confidence scores
- **Scene description** — natural language summary of the image
- **Image attributes** — dominant colors, scene type, style, and more
- **Custom instructions** — ask anything about the image
- **Raw JSON viewer** — inspect the full API response
- **Dark mode support** — auto-adapts to system preference

## 🚀 Live Demo

👉 [Try it on GitHub Pages](https://YOUR_USERNAME.github.io/YOUR_REPO/)

## 📁 Project Structure

```
image-prediction-api/
├── index.html           # Main entry point
├── src/
│   ├── css/
│   │   └── styles.css   # All styles + dark mode
│   └── js/
│       ├── config.js    # API config & color constants
│       ├── api.js       # Anthropic API call logic
│       ├── ui.js        # Rendering & UI helpers
│       └── main.js      # App state, events, orchestration
├── .gitignore
└── README.md
```

## 🛠️ Setup

No build step or installation needed. Just open `index.html` in a browser, or serve with any static file server:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

You'll need an **Anthropic API key**:
1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Generate an API key
3. Paste it into the API Key field in the app

> ⚠️ Your API key is sent directly to `api.anthropic.com` from your browser and is never stored or logged anywhere.

## 🚢 Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Then: **Settings → Pages → Source: Deploy from branch → `main` → Save**

Your app will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## 🧑‍💻 How It Works

1. User uploads an image (JPG, PNG, WebP, GIF)
2. The image is base64-encoded in the browser
3. A request is sent to the Anthropic API with the image and a structured JSON prompt
4. Claude analyzes the image and returns labels, description, and metadata
5. The UI renders the results with animated confidence bars

## 📦 Tech Stack

- Plain HTML / CSS / JavaScript — no frameworks, no build step
- [Anthropic Claude](https://www.anthropic.com) (`claude-sonnet-4-20250514`) for vision inference
- [Tabler Icons](https://tabler.io/icons) for UI icons

## 📄 License

MIT
