async function bug(message, client, texts, num) {
    try {
        const remoteJid = message.key?.remoteJid;

        await client.sendMessage(remoteJid, {
            image: { url: `database/${num}.jpg` },
            caption: `> ${texts}`,
            contextInfo: {
                externalAdReply: {
                    title: "Join Our WhatsApp Group",
                    body: "ObameBot",
                    mediaType: 1,
                    thumbnailUrl: "https://chat.whatsapp.com/DP9IDrxuGxH160t1yYympW?s=cl&p=a&mlu=4",
                    renderLargerThumbnail: false,
                    mediaUrl: `${num}.jpg`,
                    sourceUrl: "https://chat.whatsapp.com/DP9IDrxuGxH160t1yYympW?s=cl&p=a&mlu=4"
                }
            }
        });

    } catch (e) {
        console.log(e);
    }
}

export default bug;