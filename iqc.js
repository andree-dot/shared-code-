const axios = require("axios");
const config = require("@config");
const { logCustom } = require("@lib/logger");
const mess = require("@mess");
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
require("moment/locale/id");

// ===== KONFIGURASI PATH MEDIA (d kecil) =====
const loadingStickerPath = path.join(process.cwd(), "database", "media", "loading.webp");

// Daftar provider seluler untuk variasi tampilan
const signalList = ["Telkomsel", "Indosat Ooredoo", "XL Axiata", "Tri", "Smartfren", "By.U"];

async function handle(sock, messageInfo) {
    const { remoteJid, message, content, isQuoted, prefix, command, sender } = messageInfo;

    try {
        // Deteksi teks dari input langsung atau pesan yang di-quote
        const text = content && content.trim() !== '' ? content : isQuoted?.text ?? null;

        if (!text) {
            await sock.sendMessage(remoteJid, {
                text: `_⚠️ Format Penggunaan:_\n\n_💬 Contoh:_ _*${prefix + command} Semangat pagi!*_`
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

        // ==========================================
        // = Pengaturan Waktu & Signal Otomatis     =
        // ==========================================
        const realTime = moment().tz("Asia/Jakarta").format("HH:mm"); 
        const randomSignal = signalList[Math.floor(Math.random() * signalList.length)];
        const apiKey = "freeApikey";

        // Konfigurasi visual (Dark Mode)
        const settings = {
            bubble: "#272a2f",
            menu: "#272a2f",
            text: "#FFFFFF",
            font: "Arial"
        };

        // ==========================================
        // = Panggil API anabot.my.id               =
        // ==========================================
        const apiUrl = `https://anabot.my.id/api/maker/iqc?text=${encodeURIComponent(text.trim())}&chatTime=${encodeURIComponent(realTime)}&statusBarTime=${encodeURIComponent(realTime)}&bubbleColor=${encodeURIComponent(settings.bubble)}&menuColor=${encodeURIComponent(settings.menu)}&textColor=${encodeURIComponent(settings.text)}&fontName=${encodeURIComponent(settings.font)}&signalName=${encodeURIComponent(randomSignal)}&apikey=${apiKey}`;

        const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
        
        // Cek jika response adalah JSON (berarti error)
        const contentType = response.headers['content-type'];
        if (contentType.includes('application/json')) {
            const result = JSON.parse(response.data.toString());
            throw new Error(result.message||"API Error");
        }

        const buffer = response.data;

        // ==========================================
        // = Kirim Hasil dengan Auto Detect Caption =
        // ==========================================
        await sock.sendMessage(remoteJid, {
            image: buffer,
            caption: `*「 IPHONE QUOTED CHAT 」*\n\n` +
                     `*💬 Pesan:* ${text.trim()}\n` +
                     `*📶 Sinyal:* ${randomSignal}\n` +
                     `*🕒 Waktu:* ${realTime}\n\n` +
                     `_${mess.general.success||"Berhasil memproses gambar!"}_`
        }, { quoted: message });

        await sock.sendMessage(remoteJid, {
            react: { text: "✅", key: message.key }
        });

    } catch (error) {
        console.error(error);
        logCustom('info', `ERROR-IQC: ${error.message}`, `ERROR-IQC.txt`);
        await sock.sendMessage(remoteJid, {
            text: `❌ Terjadi kesalahan saat memproses permintaan.\n\n_Pesan: ${error.message}_`
        }, { quoted: message });
    }
}

module.exports = {
    handle,
    Commands: ['iqc'],
    OnlyPremium: false,
    OnlyOwner: false,
    limitDeduction: 2
};
