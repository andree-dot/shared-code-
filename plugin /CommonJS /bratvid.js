
const config = require("@config");
const axios = require('axios');
const { sendImageAsSticker } = require("@lib/exif");
const { logCustom } = require("@lib/logger");
const fs = require("fs");
const path = require("path");

// ===== KONFIGURASI PATH MEDIA (d kecil) =====
const loadingStickerPath = path.join(process.cwd(), "database", "media", "loading.webp");

async function handle(sock, messageInfo) {
    const { remoteJid, message, content, isQuoted, prefix, command } = messageInfo;

    try {
        const text = content && content.trim() !== '' ? content : isQuoted?.text ?? null;

        // Validasi input
        if (!text) {
            await sock.sendMessage(remoteJid, {
                text: `_⚠️ Format Penggunaan:_\n\n_💬 Contoh:_ *${prefix + command} halo*`
            }, { quoted: message });
            return;
        }

        // ===== GANTI REACTION JADI STIKER LOADING DARI database/media =====
        if (fs.existsSync(loadingStickerPath)) {
            await sock.sendMessage(remoteJid, { 
                sticker: fs.readFileSync(loadingStickerPath) 
            }, { quoted: message });
        } else {
            // Fallback reaction jika file stiker tidak ditemukan
            await sock.sendMessage(remoteJid, { react: { text: "⏳", key: message.key } });
        }

        // Encode text
        const sanitizedContent = encodeURIComponent(text.trim().replace(/\n+/g, " "));

        // ===== API FAA =====
        const api = `https://api-faa.my.id/faa/bratvid?text=${sanitizedContent}`;
        const response = await axios.get(api, { responseType: "arraybuffer" });
        const buffer = response.data;

        const options = {
            packname: config.sticker_packname,
            author: config.sticker_author,
        };

        // Kirim sebagai sticker
        await sendImageAsSticker(sock, remoteJid, buffer, options, message);

        // React sukses
        await sock.sendMessage(remoteJid, {
            react: { text: "✅", key: message.key }
        });

    } catch (error) {
        logCustom('info', content, `ERROR-COMMAND-${command}.txt`);

        await sock.sendMessage(remoteJid, {
            text: `❌ Gagal memproses.\n\n${error.message}`
        }, { quoted: message });
    }
}

module.exports = {
    handle,
    Commands: ['bratvid','bv','bratgif'],
    OnlyPremium: false,
    OnlyOwner: false,
    limitDeduction: 2
};
