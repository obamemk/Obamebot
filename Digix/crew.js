import {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} from 'baileys';

import configmanager from '../utils/configmanager.js';
import pino from 'pino';
import fs from 'fs';

const data = 'sessionData';

// Numéro WhatsApp d'ObameBot
const OWNER_NUMBER = '24174769169';

async function connectToWhatsapp(handleMessage) {

    const { version } = await fetchLatestBaileysVersion();

    console.log('Baileys version:', version);

    const { state, saveCreds } =
        await useMultiFileAuthState(data);

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        logger: pino({ level: 'silent' }),
        keepAliveIntervalMs: 10000,
        connectTimeoutMs: 60000,
        generateHighQualityLinkPreview: true
    });

    /*
     * Sauvegarde des identifiants WhatsApp
     */
    sock.ev.on('creds.update', saveCreds);

    /*
     * Gestion de la connexion
     */
    sock.ev.on('connection.update', async (update) => {

        const {
            connection,
            lastDisconnect
        } = update;

        /*
         * Déconnexion
         */
        if (connection === 'close') {

            const statusCode =
                lastDisconnect?.error?.output?.statusCode;

            const reason =
                lastDisconnect?.error?.toString() || 'unknown';

            console.log(
                '❌ ObameBot déconnecté:',
                reason,
                'StatusCode:',
                statusCode
            );

            const shouldReconnect =
                statusCode !== DisconnectReason.loggedOut;

            if (shouldReconnect) {

                console.log(
                    '🔄 Reconnexion dans 5 secondes...'
                );

                setTimeout(() => {
                    connectToWhatsapp(handleMessage);
                }, 5000);

            } else {

                console.log(
                    '🚫 Session déconnectée définitivement.'
                );

                console.log(
                    'Supprime sessionData puis réappaire ObameBot.'
                );
            }
        }

        /*
         * Connexion en cours
         */
        else if (connection === 'connecting') {

            console.log(
                '⏳ ObameBot se connecte à WhatsApp...'
            );
        }

        /*
         * Connexion réussie
         */
        else if (connection === 'open') {

            console.log(
                '✅ ObameBot est connecté à WhatsApp !'
            );

            /*
             * Message de bienvenue au propriétaire
             */
            try {

                const chatId =
                    `${OWNER_NUMBER}@s.whatsapp.net`;

                const imagePath =
                    './database/ObameBot.jpg';

                const messageText = `
╭━━━━━━━━━━━━━━━━━━╮
       🤖 *OBAMEBOT*
╰━━━━━━━━━━━━━━━━━━╯

✅ *Connexion réussie !*

> ObameBot est maintenant connecté à WhatsApp.

⚡ *Bot opérationnel*
👑 *Propriétaire :* ${OWNER_NUMBER}

╭━━━━━━━━━━━━━━━━━━╮
       *OBAMEBOT*
╰━━━━━━━━━━━━━━━━━━╯
                `;

                if (fs.existsSync(imagePath)) {

                    await sock.sendMessage(chatId, {
                        image: {
                            url: imagePath
                        },
                        caption: messageText,
                        footer: '⚡ Powered by ObameBot'
                    });

                } else {

                    await sock.sendMessage(chatId, {
                        text: messageText
                    });

                    console.warn(
                        '⚠️ Image ObameBot.jpg introuvable.'
                    );
                }

                console.log(
                    '📨 Message de connexion envoyé.'
                );

            } catch (err) {

                console.error(
                    '❌ Erreur lors du message de connexion:',
                    err
                );
            }

            /*
             * Réception des messages
             */
            sock.ev.on(
                'messages.upsert',
                async (msg) => {

                    try {

                        await handleMessage(
                            sock,
                            msg
                        );

                    } catch (error) {

                        console.error(
                            '❌ Erreur messageHandler:',
                            error
                        );
                    }
                }
            );
        }
    });

    /*
     * Première connexion :
     * demande du code d'appairage
     */
    setTimeout(async () => {

        if (!state.creds.registered) {

            console.log(
                '⚠️ ObameBot n'est pas encore connecté.'
            );

            try {

                /*
                 * Configuration Premium
                 */
                configmanager.premiums.premiumUser.c = {
                    creator: OWNER_NUMBER
                };

                configmanager.premiums.premiumUser.p = {
                    premium: OWNER_NUMBER
                };

                configmanager.saveP();

                /*
                 * Configuration du propriétaire
                 */
                configmanager.config.users[OWNER_NUMBER] = {

                    sudoList: [
                        `${OWNER_NUMBER}@s.whatsapp.net`
                    ],

                    tagAudioPath:
                        'database/ObameBot.mp3',

                    antilink: true,

                    response: true,

                    autoreact: false,

                    prefix: '.',

                    reaction: '⚡',

                    welcome: true,

                    record: true,

                    type: true,

                    publicMode: false
                };

                configmanager.save();

                /*
                 * Demande du code d'appairage
                 */
                console.log(
                    `🔐 Demande du code d'appairage pour ${OWNER_NUMBER}...`
                );

                const code =
                    await sock.requestPairingCode(
                        OWNER_NUMBER,
                        'OBAMEBOT'
                    );

                console.log('');
                console.log(
                    '╔══════════════════════════╗'
                );
                console.log(
                    '║   🤖 OBAMEBOT PAIRING    ║'
                );
                console.log(
                    '╚══════════════════════════╝'
                );
                console.log('');
                console.log(
                    '📱 Numéro:',
                    OWNER_NUMBER
                );
                console.log(
                    '🔑 Code:',
                    code
                );
                console.log('');
                console.log(
                    '➡️ Entre ce code dans WhatsApp pour associer ObameBot.'
                );
                console.log('');

            } catch (error) {

                console.error(
                    '❌ Erreur lors de la demande du code:',
                    error
                );
            }
        }

    }, 5000);

    return sock;
}

export default connectToWhatsapp;