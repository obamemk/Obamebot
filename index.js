import connectToWhatsapp from './ObameBot/crew.js'
import handleIncomingMessage from './events/messageHandler.js'

(async () => {
    await connectToWhatsapp(handleIncomingMessage)
    console.log('ObameBot est connecté à WhatsApp !')
})()