import { writeFileSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { downloadMediaMessage } from 'baileys'

export async function setpp(client, message) {
    const remoteJid = message.key.remoteJid

    try {
        const quoted =
            message.message?.extendedTextMessage?.contextInfo?.quotedMessage

        const directImage = message.message?.imageMessage

        if (!quoted && !directImage) {
            return await client.sendMessage(remoteJid, {
                text: '📷 Réponds à une image.'
            })
        }

        const media = quoted
            ? {
                key: {
                    remoteJid,
                    id: message.message.extendedTextMessage.contextInfo.stanzaId,
                    fromMe: false
                },
                message: quoted
            }
            : message

        const imageBuffer = await downloadMediaMessage(
            media,
            'buffer',
            {},
            client
        )

        if (!imageBuffer) {
            return await client.sendMessage(remoteJid, {
                text: '❌ Impossible de télécharger l’image.'
            })
        }

        const tempPath = join(
            tmpdir(),
            `obamebot_pp_${Date.now()}.jpg`
        )

        writeFileSync(tempPath, imageBuffer)

        await client.updateProfilePicture(
            client.user.id,
            { url: tempPath }
        )

        unlinkSync(tempPath)

        await client.sendMessage(remoteJid, {
            text: '✅ Photo de profil changée 🤖'
        })

    } catch (err) {
        console.error('SETPP ERROR:', err)

        await client.sendMessage(remoteJid, {
            text: '❌ Impossible de changer la photo de profil.'
        })
    }
}


export async function getpp(client, message) {
    const remoteJid = message.key.remoteJid

    try {
        const text =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            ''

        const args = text.trim().split(/\s+/)

        let targetJid

        // .getpp @numéro
        if (args[1]?.includes('@')) {
            targetJid = args[1]
        }

        // Réponse à un message
        else if (
            message.message?.extendedTextMessage
                ?.contextInfo?.participant
        ) {
            targetJid =
                message.message.extendedTextMessage
                    .contextInfo.participant
        }

        // Photo du groupe
        else if (remoteJid.includes('@g.us')) {
            targetJid = remoteJid
        }

        // Photo du bot
        else {
            targetJid =
                client.user.id.split(':')[0] +
                '@s.whatsapp.net'
        }

        const profilePic =
            await client.profilePictureUrl(
                targetJid,
                'image'
            )

        if (!profilePic) {
            return await client.sendMessage(remoteJid, {
                text: '❌ Aucune photo trouvée.'
            })
        }

        await client.sendMessage(remoteJid, {
            image: { url: profilePic },
            caption: '📷 Photo récupérée ✅'
        })

    } catch (err) {
        console.error('GETPP ERROR:', err)

        await client.sendMessage(remoteJid, {
            text: '❌ Impossible de récupérer la photo.'
        })
    }
}


export default {
    setpp,
    getpp
}