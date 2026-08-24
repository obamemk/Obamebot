export async function uptime(client, message) {
    const remoteJid = message.key.remoteJid
    const uptime = process.uptime()

    const days = Math.floor(uptime / 86400)
    const hours = Math.floor((uptime % 86400) / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)

    const ram = (
        process.memoryUsage().heapUsed /
        1024 /
        1024
    ).toFixed(1)

    const text = `╭━━━〔 🤖 OBAMEBOT 〕━━━╮
┃
┃ ⏱️ Uptime:
┃ ${days}d ${hours}h ${minutes}m ${seconds}s
┃
┃ 💾 RAM: ${ram} MB
┃
┃ 🚀 Beyond limits, we rise.
┃        - OBAMEBOT -
┃
╰━━━━━━━━━━━━━━━━━━━━╯`

    await client.sendMessage(remoteJid, {
        text: text
    })
}

export default uptime