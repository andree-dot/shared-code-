
const axios = require('axios');
const config = require("@config");
const { getProfilePictureUrl } = require("@lib/cache");
const { sendImageAsSticker } = require("@lib/exif");
const fs = require("fs");
const path = require("path");

// ===== KONFIGURASI PATH MEDIA (d kecil) =====
const loadingStickerPath = path.join(process.cwd(), "database", "media", "loading.webp");

async function handle(sock, messageInfo) {
    const { remoteJid, message, sender, content, isQuoted, prefix, command, pushName } = messageInfo;

    try {
        const text = content && content.trim() !== '' ? content : isQuoted?.text ?? null;

        if (!text) {
            await sock.sendMessage(remoteJid, {
                text: `_⚠️ Format Penggunaan:_ \n\n_💬 Contoh:_ _*${prefix + command} halo*_`
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

        const ppUser = await getProfilePictureUrl(sock, sender);

        // === API FAA QC BLACK ===
        // Menggunakan parameter: q, username, dan avatar
        const apiUrl = `https://api-faa.my.id/faa/qc-black?q=${encodeURIComponent(text)}&username=${encodeURIComponent(pushName)}&avatar=${encodeURIComponent(ppUser)}`;

        const res = await axios.get(apiUrl);
        
        // Cek status dari JSON response
        if (res.data && res.data.status) {
            const imageUrl = res.data.result.qc_image;

            // Mengambil buffer gambar dari URL yang diberikan API
            const imageRes = await axios.get(imageUrl, {
                responseType: "arraybuffer"
            });

            const buffer = Buffer.from(imageRes.data, "binary");

            const options = {
                packname: config.sticker_packname,
                author: config.sticker_author,
            };

            await sendImageAsSticker(sock, remoteJid, buffer, options, message);
            
            // React sukses setelah stiker terkirim
            await sock.sendMessage(remoteJid, { react: { text: "✅", key: message.key } });
            
        } else {
            throw new Error("Gagal mendapatkan respons valid dari API.");
        }

    } catch (error) {
        console.error(error);
        await sock.sendMessage(remoteJid, {
            text: `Maaf, terjadi kesalahan saat memproses permintaan.\n\nError: ${error.message}`
        }, { quoted: message });
    }
}

module.exports = {
    handle,
    Commands: ['qc'],
    OnlyPremium: false,
    OnlyOwner: false,
    limitDeduction: 2,
};
