case "removebg": {
        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || q.mediaType || '';

        if (!/image|sticker|webp/i.test(mime)) {
          return m.reply(`Reply to an image, sticker, or webp with *${prefix + command}* to remove its background.`);
        }

        await m.react('⏳');

        try {
          let media = await q.download();
          if (!media) throw new Error('Failed to download media.');


          const tmpDir = path.join(process.cwd(), 'tmp');
          fs.mkdirSync(tmpDir, {
            recursive: true
          });

          const timestamp = Date.now();
          const tempFile = path.join(tmpDir, `upload_${timestamp}.jpg`);
          fs.writeFileSync(tempFile, media);

          const form = new FormData();
          form.append('image', fs.createReadStream(tempFile));
          form.append('format', 'png');

          const res = await axios.post('https://api2.pixelcut.app/image/matte/v1', form, {
            headers: {
              ...form.getHeaders(),
              'x-client-version': 'web'
            },
            responseType: 'arraybuffer',
            timeout: 60000,
          });

          if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);

          return conn.sendFile(m.chat, res.data, 'removebg.png', '✅ Background removed successfully!', m);
        } catch (e) {
          console.error(e);
          return m.reply(`An error occurred: ${e.message}`);
        }
      }
      break;
