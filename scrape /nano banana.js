const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')
const path = require('path')

function genserial() {
  let s = ''
  for (let i = 0; i < 32; i++) s += Math.floor(Math.random() * 16).toString(16)
  return s
}

async function upimage(filename) {
  const form = new FormData()
  form.append('file_name', filename)

  const res = await axios.post('https://api.imgupscaler.ai/api/common/upload/upload-image',
    form,
    {
      headers: {
        ...form.getHeaders(),
        origin: 'https://imgupscaler.ai',
        referer: 'https://imgupscaler.ai/'
      }
    }
  )

  return res.data.result
}

async function uploadtoOSS(putUrl, filePath) {
  const file = fs.readFileSync(filePath)
  const type = path.extname(filePath) === '.png' ? 'image/png' : 'image/jpeg'

  const res = await axios.put(
    putUrl,
    file,
    {
      headers: {
        'Content-Type': type,
        'Content-Length': file.length
      },
      maxBodyLength: Infinity
    }
  )

  return res.status === 200
}

async function createJob(imageUrl, prompt) {
  const form = new FormData()
  form.append('model_name', 'magiceraser_v4')
  form.append('original_image_url', imageUrl)
  form.append('prompt', prompt)
  form.append('ratio', 'match_input_image')
  form.append('output_format', 'jpg')

  const res = await axios.post('https://api.magiceraser.org/api/magiceraser/v2/image-editor/create-job',
    form,
    {
      headers: {
        ...form.getHeaders(),
        'product-code': 'magiceraser',
        'product-serial': genserial(),
        origin: 'https://imgupscaler.ai',
        referer: 'https://imgupscaler.ai/'
      }
    }
  )

  return res.data.result.job_id
}

async function cekjob(jobId) {
  const res = await axios.get(`https://api.magiceraser.org/api/magiceraser/v1/ai-remove/get-job/${jobId}`,
    {
      headers: {
        origin: 'https://imgupscaler.ai',
        referer: 'https://imgupscaler.ai/'
      }
    }
  )

  return res.data
}

async function nanobanana(imagePath, prompt) {
  const filename = path.basename(imagePath)

  const uploadInfo = await upimage(filename)
  await uploadtoOSS(uploadInfo.url, imagePath)

  const cdn = 'https://cdn.imgupscaler.ai/' + uploadInfo.object_name
  const jobId = await createJob(cdn, prompt)

  let result
  do {
    await new Promise(r => setTimeout(r, 3000))
    result = await cekjob(jobId)
  } while (result.code === 300006)

  return {
    job_id: jobId,
    image: result.result.output_url[0]
  }
}

nanobanana('./input.jpg', 'ubah agar dia tersenyum')
.then(console.log)
.catch(console.error)
/*
{
  job_id: 'c904c0a2-257c-4626-96f0-0840e6beff63',
  image: 'https://cdn.magiceraser.org/datarm/magiceraser/image/image-editor/q1/2026-01-25/output/c904c0a2-257c-4626-96f0-0840e6beff63.png'
}
*/
