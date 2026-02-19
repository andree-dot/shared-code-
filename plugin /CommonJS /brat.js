
const config = require("@config");
const axios = require("axios");
const { sendImageAsSticker } = require("@lib/exif");
const { logCustom } = require("@lib/logger");
const fs = require("fs");
const path = require("path");

// ===== KONFIGURASI PATH MEDIA (d kecil) =====
const loadingStickerPath = path.join(process.cwd(), "database", "media", "loading.webp");

/* ────── Main handler (tanpa Remini HD) ────── */
async function handle(sock, messageInfo) {
  const { remoteJid, message, content, isQuoted, prefix, command } = messageInfo;

  try {
    const text = content?.trim() !== "" ? content : isQuoted?.text ?? null;
    if (!text) {
      return await sock.sendMessage(
        remoteJid,
        {
          text: `_⚠️ format penggunaan:_ \n\n_💬 contoh:_ _*${prefix + command} Andre tamvan*_`,
        },
        { quoted: message }
      );
    }

    // ===== GANTI REACTION JADI STIKER LOADING DARI database/media =====
    if (fs.existsSync(loadingStickerPath)) {
      await sock.sendMessage(remoteJid, { 
        sticker: fs.readFileSync(loadingStickerPath) 
      }, { quoted: message });
    } else {
      // Fallback reaction jika file stiker tidak ditemukan
      await sock.sendMessage(remoteJid, { react: { text: "🕐", key: message.key } });
    }

    // Ambil gambar brat langsung dari API
    const bratUrl = `https://api-faa.my.id/faa/brathd?text=${encodeURIComponent(text.replace(/\n+/g, " "))}`;
    const bratRes = await axios.get(bratUrl, { responseType: "arraybuffer", timeout: 180000 });

    if (bratRes.status !== 200||!bratRes.data) {
      throw new Error("Gagal mengambil gambar brat");
    }

    // Kirim sebagai stiker langsung (tanpa HD processing)
    await sendImageAsSticker(
      sock,
      remoteJid,
      bratRes.data,
      {
        packname: config.sticker_packname,
        author: config.sticker_author
      },
      message
    );

    // React sukses
    await sock.sendMessage(remoteJid, { react: { text: "✅", key: message.key } });

  } catch (err) {
    logCustom("info", content, `ERROR-COMMAND-${command}.txt`);
    await sock.sendMessage(
      remoteJid,
      { text: `❌ Gagal memproses:\n${err.message}` },
      { quoted: message }
    );
  }
}

/* ────── Export ────── */
module.exports = {
  handle,
  Commands: ["brat","b"],
  OnlyPremium: false,
  OnlyOwner: false,
  limitDeduction: 2
};
