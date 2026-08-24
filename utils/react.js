export default async function react(client, message) {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const remoteJid = message?.key?.remoteJid;

    if (!remoteJid || !message?.key) return;

    await client.sendMessage(remoteJid, {
        react: {
            text: '🎯',
            key: message.key
        }
    });

    await sleep(1000);

    await client.sendMessage(remoteJid, {
        react: {
            text: '⚡',
            key: message.key
        }
    });

    await sleep(1000);

    await client.sendMessage(remoteJid, {
        react: {
            text: '',
            key: message.key
        }
    });
}