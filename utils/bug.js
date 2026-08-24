async function obameMessage(message, client, texts, num) {
    try {
        const remoteJid = message.key?.remoteJid;

        if (!remoteJid) return;

        const groupLink = "https://chat.whatsapp.com/DP9IDrxuGxH160t1yYympW";

        await client.sendMessage(remoteJid, {
            image: {
                url: `database/${num}.jpg`
            },
            caption: `> ${texts}`,

            contextInfo: {
                externalAdReply: {
                    title: "🤖 Groupe officiel ObameBot",
                    body: "Rejoins notre groupe WhatsApp",
                    mediaType: 1,
                    renderLargerThumbnail: false,
                    sourceUrl: groupLink
                }
            }
        });

    } catch (e) {
        console.log("Erreur ObameBot :", e);
    }
}

export default bug;