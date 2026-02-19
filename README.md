<div align="center">

<img src="https://capsule-render.vercel.app/render?type=soft&color=auto&height=250&section=header&text=PREMIUM%20SCRAPER%20ENGINE&fontSize=70&animation=fadeIn&fontAlignY=35" width="100%" />

<br>

<p align="center">
  <img src="https://img.shields.io/github/stars/yourusername/your-repo?style=for-the-badge&logo=github&color=FFD700&logoColor=white" />
  <img src="https://img.shields.io/github/forks/yourusername/your-repo?style=for-the-badge&logo=github-sponsors&color=00BFFF&logoColor=white" />
  <img src="https://img.shields.io/github/languages/top/yourusername/your-repo?style=for-the-badge&logo=javascript&color=F7DF1E&logoColor=black" />
</p>

<p align="center">
  <a href="https://whatsapp.com/channel/120363419620210385@newsletter">
    <img src="https://img.shields.io/badge/Official_Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" />
  </a>
  <img src="https://img.shields.io/badge/Status-Stable-success?style=for-the-badge&logo=checkmarx" />
</p>

---

### ⚡ "High-Performance Scrapers for Modern Bot Systems"
*Script ini dirancang untuk kecepatan maksimal, bypass proteksi, dan kemudahan integrasi.*

[Fitur](#-key-features) • [Daftar Plugin](#-premium-plugin-list) • [Instalasi](#-quick-start) • [Channel](#-stay-updated)

</div>

---

## 💎 Key Features
<table>
  <tr>
    <td width="50%"><b>🚀 Ultra Fast</b><br>Optimasi kode berbasis asynchronous (async/await).</td>
    <td width="50%"><b>🛡️ Anti-Detection</b><br>Rotasi User-Agent dan Headers otomatis.</td>
  </tr>
  <tr>
    <td width="50%"><b>📦 Modular Case</b><br>Tinggal copy-paste ke switch(command) bot kamu.</td>
    <td width="50%"><b>🌐 Multi-Source</b><br>Mendukung 50+ website (Social Media & Tools).</td>
  </tr>
</table>

---

## 📂 Premium Plugin List
| Category | Plugin Name | Quality | Status |
| :---: | :--- | :---: | :---: |
| 🎥 | **TikTok No Watermark** | HD / 4K | 🟢 Active |
| 📸 | **Instagram Reel/Post** | Original | 🟢 Active |
| 🎵 | **Spotify Downloader** | 320kbps | 🟡 Maintenance |
| 🔍 | **Google Search Engine** | Fast | 🟢 Active |
| 🖼️ | **Pinterest Scraper** | High-Res | 🟢 Active |
| 🎭 | **Character AI Chat** | API v2 | 🟢 Active |

---

## 🛠️ Built With
<div align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/Cheerio-E88C1F?style=flat-square&logo=cheerio&logoColor=white" />
  <img src="https://img.shields.io/badge/Rest_API-000000?style=flat-square&logo=express&logoColor=white" />
</div>

---

## 🚀 Quick Start

### 1. Requirements
* Node.js v16 or higher
* Library: `axios`, `cheerio`, `form-data`

### 2. Integration Example
Gunakan struktur premium case ini agar rapi di file utama bot kamu:

```javascript
/* PREMIUM SCRAPER CASE 
  Usage: .tiktok <url>
*/
case 'tiktok': {
  if (!text) return reply('Mana linknya?')
  m.reply(mess.wait)
  try {
    let res = await Scraper.tiktok(text)
    await conn.sendMessage(m.chat, { 
       video: { url: res.download.nowm }, 
       caption: `✨ *TikTok Success*\n👤 *Author:* ${res.author.nickname}` 
    }, { quoted: m })
  } catch (e) {
    reply('Fitur error, sedang diperbaiki.')
  }
}
break
