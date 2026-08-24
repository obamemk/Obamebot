import axios from 'axios'
import { downloadMediaMessage } from 'baileys'
import { fileTypeFromBuffer } from 'file-type'
import FormData from 'form-data'

async function uploadToCatbox(buffer, fileName) {
    const form = new FormData()

    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', buffer, {
        filename: fileName
    })

    const res = await axios.post(
        'https://catbox.moe/user/api.php',
        form,
        {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        }
    )

    return res.data.trim()
}

async function url(client, message) {
    const jid = message.key.remoteJid
    const ctx = message.message?.extendedTextMessage?.contextInfo

    if (!ctx?.quotedMessage) {
        return client.sendMessage(jid, {
            text: '❌ Réponds à une image, vidéo, audio ou document.'
        })
    }

    let mediaMessage
    let ext = 'bin'

    if (ctx.quotedMessage.imageMessage) {
        mediaMessage = {
            imageMessage: ctx.quotedMessage.imageMessage
        }
        ext = 'jpg'
    } else if (ctx.quotedMessage.videoMessage) {
        mediaMessage = {
            videoMessage: ctx.quotedMessage.videoMessage
        }
        ext = 'mp4'
    } else if (ctx.quotedMessage.audioMessage) {
        mediaMessage = {
            audioMessage: ctx.quotedMessage.audioMessage
        }
        ext = 'mp3'
    } else if (ctx.quotedMessage.documentMessage) {
        mediaMessage = {
            documentMessage: ctx.quotedMessage.documentMessage
        }

        ext =
            ctx.quotedMessage.documentMessage.fileName
                ?.split('.')
                .pop() || 'bin'
    } else {
        return client.sendMessage(jid, {
            text: '❌ Média non supporté.'
        })
    }

    try {
        await client.sendMessage(jid, {
            text: '⏳ Upload en cours...'
        })

        const buffer = await downloadMediaMessage(
            {
                key: {
                    remoteJid: jid,
                    id: ctx.stanzaId,
                    fromMe: false
                },
                message: mediaMessage
            },
            'buffer',
            {},
            client
        )

        const type = await fileTypeFromBuffer(buffer)

        if (type?.ext) {
            ext = type.ext
        }

        const fileName = `file_${Date.now()}.${ext}`

        const link = await uploadToCatbox(
            buffer,
            fileName
        )

        await client.sendMessage(jid, {
            text: `🔗 ${link}`
        })

    } catch (error) {
        console.error('URL ERROR:', error)

        await client.sendMessage(jid, {
            text: '❌ Impossible de récupérer ou uploader ce média.'
        })
    }
}

export default url