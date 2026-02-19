
const axios = require("axios");
const { logCustom } = require("@lib/logger");
const mess = require("@mess");
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
require("moment/locale/id");

// ===== KONFIGURASI PATH MEDIA (d kecil) =====
const loadingStickerPath = path.join(process.cwd(), "database", "media", "loading.webp");

// Fake quoted biar mirip WA Channel
const fakeQuoted = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        extendedTextMessage: {
            text: "hinata Assistant"
        }
    }
};

async function handle(sock, messageInfo) {
    const { remoteJid, message, content, isQuoted, prefix, command } = messageInfo;

    try {
        let text = content && content.trim() !== '' ? content : isQuoted?.text ?? null;

        // Validasi input
        if (!text) {
            await sock.sendMessage(remoteJid, {
                text: `_⚠️ Format Penggunaan:_\n\n_💬 Contoh:_ _*${prefix + command} Andre tamvan|14.30|80%*_`
            }, { quoted: null });
            return;
        }

        // Pisahkan input|prompt|jam|batre
        const parts = text.split("|").map(s => s.trim());
        const prompt = encodeURIComponent(parts[0]); // prompt wajib
        const jam = parts[1] ? encodeURIComponent(parts[1]) : moment().tz("Asia/Jakarta").format("HH.mm");
        const batre = parts[2] ? encodeURIComponent(parts[2]) : "100%";

        // ===== GANTI REACTION JADI STIKER LOADING DARI database/media =====
        if (fs.existsSync(loadingStickerPath)) {
            await sock.sendMessage(remoteJid, { 
                sticker: fs.readFileSync(loadingStickerPath) 
            }, { quoted: message });
        } else {
            // Fallback reaction jika file stiker tidak ditemukan
            await sock.sendMessage(remoteJid, { react: { text: "⏳", key: message.key } });
        }

        // Panggil API
        const apiUrl = `https://api-faa.my.id/faa/iqcv2?prompt=${prompt}&jam=${jam}&batre=${batre}`;
        const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
        const buffer = response.data;

        // Kirim hasil gambar
        await sock.sendMessage(remoteJid, {
            image: buffer,
            caption: mess.general.success
        }, { quoted: message });

        // Reaction berhasil
        await sock.sendMessage(remoteJid, {
            react: {
                text: "✅",
                key: message.key
            }
        });

    } catch (error) {
        logCustom('info', content, `ERROR-COMMAND-${command}.txt`);
        const errorMessage = `Maaf, terjadi kesalahan saat memproses permintaan Anda. Coba lagi nanti.\n\nError: ${error.message}`;
        await sock.sendMessage(remoteJid, { text: errorMessage }, { quoted: message });
    }
}

module.exports = {
    handle,
    Commands: ['iqcv2', 'iv2'],
    OnlyPremium: false,
    OnlyOwner: false,
    limitDeduction: 2
};
