<h1 align="center">
  🌈 SHARE CODE PLUGINS 🌈
</h1>

<p align="center">
  <b>CommonJS • ESM • Scraper • Utilities • Modular Plugins</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js">
  <img src="https://img.shields.io/badge/Module-CJS%20%7C%20ESM-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/Status-Stable-brightgreen?style=for-the-badge">
  <img src="https://img.shields.io/badge/License-MIT-orange?style=for-the-badge">
</p>

---

## 📦 About This Repository

Repository ini berisi kumpulan:

- ✅ Plugin CommonJS (CJS)
- ✅ Plugin ES Module (ESM)
- ✅ Web Scraper Ready
- ✅ API Integration
- ✅ Utilities Functions
- ✅ Modular System Support
- ✅ Clean & Production Ready Code

Cocok untuk:
- 🤖 WhatsApp Bot
- 🌐 Web Automation
- 📡 API Scraper
- 🧩 Modular Plugin System
- ⚡ Backend Tools

---

# 📂 Folder Structure

```
share-code/
│
├── plugins/
│   ├── cjs/
│   ├── esm/
│   └── scraper/
│
├── lib/
│   ├── utils.js
│   └── helper.js
│
├── config/
│   └── config.js
│
├── index.js
└── package.json
```

---

# ⚙️ Installation

```bash
git clone https://github.com/username/share-code.git
cd share-code
npm install
```

---

# 🚀 Usage

## 🔹 CommonJS Example

```js
// plugins/cjs/hello.js
module.exports = async function (m, { reply }) {
    reply("Hello from CJS Plugin 🚀");
};
```

## 🔹 ES Module Example

```js
// plugins/esm/hello.mjs
export default async function (m, { reply }) {
    reply("Hello from ESM Plugin 🌈");
}
```

---

# 🌐 Scraper Example

```js
const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeExample(url) {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $("title").text();

    return {
        status: true,
        title
    };
}

module.exports = scrapeExample;
```

---

# 🧠 Plugin Handler Example

```js
const fs = require("fs");
const path = require("path");

async function loadPlugins(dir) {
    const files = fs.readdirSync(dir);
    const plugins = [];

    for (const file of files) {
        if (file.endsWith(".js")) {
            const plugin = require(path.join(dir, file));
            plugins.push(plugin);
        }
    }

    return plugins;
}

module.exports = loadPlugins;
```

---

# 🔥 Features

- Modular Architecture
- Easy Plugin Integration
- Clean Code Structure
- Error Handling System
- Async/Await Ready
- Production Ready

---

# 📡 API Response Format Standard

```json
{
  "status": true,
  "creator": "share-code",
  "data": {}
}
```

---

# 🛡 Anti Error Pattern

```js
try {
   // your code
} catch (err) {
   console.error("Error:", err.message);
}
```

---

# 📜 Environment Example

Create `.env`

```
API_KEY=your_api_key
OWNER_NUMBER=628xxxx
```

---

# 🧩 Supported Modules

- axios
- cheerio
- node-fetch
- fs
- path
- dotenv

---

# 🎨 Recommended Node Version

```
Node.js v18+
```

---

# 📊 Project Status

- 🟢 Stable
- 🔄 Maintained
- ⚡ Optimized

---

# 🤝 Contributing

1. Fork this repo
2. Create new branch
3. Commit your changes
4. Open Pull Request

---

# 🪪 License

MIT License © 2026

---

<p align="center">
  Made with ❤️ by Developer Community
</p>
