import configmanager from "../utils/configmanager.js"
import group from "../commands/group.js"
import block from "../commands/block.js"
import viewonce from "../commands/viewonce.js"
import tiktok from "../commands/tiktok.js"
import play from "../commands/play.js"
import sudo from "../commands/sudo.js"
import tag from "../commands/tag.js"
import sticker from "../commands/sticker.js"
import img from "../commands/img.js"
import url from "../commands/url.js"
import fuck from "../commands/fuck.js"
import save from "../commands/save.js"
import pp from "../commands/pp.js"
import premiums from "../commands/premiums.js"
import reactions from "../commands/reactions.js"
import media from "../commands/media.js"
import set from "../commands/set.js"
import fancy from "../commands/fancy.js"
import react from "../utils/react.js"
import info from "../commands/menu.js"
import { pingTest } from "../commands/ping.js"
import auto from "../commands/auto.js"
import uptime from "../commands/uptime.js"
import bug from "../commands/bug.js"

async function handleIncomingMessage(client, event) {

    try {

        const messages = event?.messages || []

        const number = client?.user?.id?.split(":")[0]

        if (!number) {
            console.log("❌ Impossible de récupérer le numéro du bot.")
            return
        }

        // Vérifie que la configuration de l'utilisateur existe
        if (!configmanager.config.users[number]) {
            console.log(
                `⚠️ Aucun profil trouvé pour ${number} dans config.json`
            )
            return
        }

        const userConfig = configmanager.config.users[number]

        const publicMode = userConfig.publicMode ?? false
        const prefix = userConfig.prefix ?? "."

        const approvedUsers = userConfig.sudoList ?? []

        // Liste Premium
        const premiumUsers =
            configmanager.premiums?.premiumUser?.p?.premium
                ? [configmanager.premiums.premiumUser.p.premium]
                : []

        for (const message of messages) {

            try {

                const remoteJid = message?.key?.remoteJid

                if (!remoteJid) continue

                /*
                 * Récupération du texte du message
                 */
                const originalText =
                    message?.message?.extendedTextMessage?.text ||
                    message?.message?.conversation ||
                    ""

                if (!originalText) {
                    await group.linkDetection(client, message)
                    continue
                }

                /*
                 * Le texte est utilisé uniquement pour détecter
                 * les commandes.
                 */
                const messageBody = originalText.toLowerCase().trim()

                console.log(
                    "📨 Message:",
                    originalText.substring(0, 50)
                )

                /*
                 * Fonctions automatiques
                 */
                try {
                    auto.autotype(client, message)
                    auto.autorecord(client, message)

                    tag.respond(client, message)

                    reactions.auto(
                        client,
                        message,
                        userConfig.autoreact ?? false,
                        userConfig.reaction ?? "⚡"
                    )
                } catch (error) {
                    console.log(
                        "⚠️ Erreur dans les fonctions automatiques :",
                        error.message
                    )
                }

                /*
                 * Vérification du préfixe
                 */
                if (!messageBody.startsWith(prefix)) {
                    await group.linkDetection(client, message)
                    continue
                }

                /*
                 * Vérification des permissions
                 */
                const sender =
                    message.key?.participant ||
                    message.key?.remoteJid

                const isOwner =
                    message.key?.fromMe === true

                const isSudo =
                    approvedUsers.includes(sender)

                const canUseCommands =
                    publicMode ||
                    isOwner ||
                    isSudo

                if (!canUseCommands) {
                    continue
                }

                /*
                 * Extraction de la commande
                 */
                const commandAndArgs =
                    originalText
                        .slice(prefix.length)
                        .trim()

                const parts =
                    commandAndArgs.split(/\s+/)

                const command =
                    parts[0].toLowerCase()

                /*
                 * Commandes
                 */
                switch (command) {

                    case "uptime":
                        await react(client, message)
                        await uptime(client, message)
                        break

                    case "ping":
                        await react(client, message)
                        await pingTest(client, message)
                        break

                    case "menu":
                        await react(client, message)
                        await info(client, message)
                        break

                    case "fancy":
                        await react(client, message)
                        await fancy(client, message)
                        break

                    case "setpp":
                        await react(client, message)
                        await pp.setpp(client, message)
                        break

                    case "getpp":
                        await react(client, message)
                        await pp.getpp(client, message)
                        break

                    /*
                     * OWNER
                     */

                    case "sudo":
                        await react(client, message)
                        await sudo.sudo(
                            client,
                            message,
                            approvedUsers
                        )
                        configmanager.save()
                        break

                    case "delsudo":
                        await react(client, message)
                        await sudo.delsudo(
                            client,
                            message,
                            approvedUsers
                        )
                        configmanager.save()
                        break

                    /*
                     * SETTINGS
                     */

                    case "public":
                        await react(client, message)
                        await set.isPublic(
                            message,
                            client
                        )
                        break

                    case "setprefix":
                        await react(client, message)
                        await set.setprefix(
                            message,
                            client
                        )
                        break

                    case "autotype":
                        await react(client, message)
                        await set.setautotype(
                            message,
                            client
                        )
                        break

                    case "autorecord":
                        await react(client, message)
                        await set.setautorecord(
                            message,
                            client
                        )
                        break

                    case "welcome":
                        await react(client, message)
                        await set.setwelcome(
                            message,
                            client
                        )
                        break

                    /*
                     * MEDIA
                     */

                    case "photo":
                        await react(client, message)
                        await media.photo(
                            client,
                            message
                        )
                        break

                    case "toaudio":
                        await react(client, message)
                        await media.tomp3(
                            client,
                            message
                        )
                        break

                    case "sticker":
                        await react(client, message)
                        await sticker(
                            client,
                            message
                        )
                        break

                    case "play":
                        await react(client, message)
                        await play(
                            message,
                            client
                        )
                        break

                    case "img":
                        await react(client, message)
                        await img(
                            message,
                            client
                        )
                        break

                    case "vv":
                        await react(client, message)
                        await viewonce(
                            client,
                            message
                        )
                        break

                    case "save":
                        await react(client, message)
                        await save(
                            client,
                            message
                        )
                        break

                    case "tiktok":
                        await react(client, message)
                        await tiktok(
                            client,
                            message
                        )
                        break

                    case "url":
                        await react(client, message)
                        await url(
                            client,
                            message
                        )
                        break

                    /*
                     * GROUP
                     */

                    case "tag":
                        await react(client, message)
                        await tag.tag(
                            client,
                            message
                        )
                        break

                    case "tagall":
                        await react(client, message)
                        await tag.tagall(
                            client,
                            message
                        )
                        break

                    case "tagadmin":
                        await react(client, message)
                        await tag.tagadmin(
                            client,
                            message
                        )
                        break

                    case "kick":
                        await react(client, message)
                        await group.kick(
                            client,
                            message
                        )
                        break

                    case "kickall":
                        await react(client, message)
                        await group.kickall(
                            client,
                            message
                        )
                        break

                    case "kickall2":
                        await react(client, message)
                        await group.kickall2(
                            client,
                            message
                        )
                        break

                    case "promote":
                        await react(client, message)
                        await group.promote(
                            client,
                            message
                        )
                        break

                    case "demote":
                        await react(client, message)
                        await group.demote(
                            client,
                            message
                        )
                        break

                    case "promoteall":
                        await react(client, message)
                        await group.pall(
                            client,
                            message
                        )
                        break

                    case "demoteall":
                        await react(client, message)
                        await group.dall(
                            client,
                            message
                        )
                        break

                    case "mute":
                        await react(client, message)
                        await group.mute(
                            client,
                            message
                        )
                        break

                    case "unmute":
                        await react(client, message)
                        await group.unmute(
                            client,
                            message
                        )
                        break

                    case "gclink":
                        await react(client, message)
                        await group.gclink(
                            client,
                            message
                        )
                        break

                    case "antilink":
                        await react(client, message)
                        await group.antilink(
                            client,
                            message
                        )
                        break

                    case "bye":
                        await react(client, message)
                        await group.bye(
                            client,
                            message
                        )
                        break

                    case "join":
                        await react(client, message)
                        await group.setJoin(
                            client,
                            message
                        )
                        break

                    /*
                     * MODERATION
                     */

                    case "block":
                        await react(client, message)
                        await block.block(
                            client,
                            message
                        )
                        break

                    case "unblock":
                        await react(client, message)
                        await block.unblock(
                            client,
                            message
                        )
                        break

                    /*
                     * PREMIUM
                     */

                    case "addprem":
                        await react(client, message)

                        await premiums.addprem(
                            client,
                            message
                        )

                        configmanager.saveP()
                        break

                    case "delprem":
                        await react(client, message)

                        await premiums.delprem(
                            client,
                            message
                        )

                        configmanager.saveP()
                        break

                    case "auto-promote":

                        await react(client, message)

                        if (
                            premiumUsers.includes(
                                number
                            ) ||
                            premiumUsers.includes(
                                number + "@s.whatsapp.net"
                            )
                        ) {

                            await group.autoPromote(
                                client,
                                message
                            )

                        } else {

                            await bug(
                                message,
                                client,
                                "Commande réservée aux utilisateurs Premium.",
                                3
                            )
                        }

                        break

                    case "auto-demote":

                        await react(client, message)

                        if (
                            premiumUsers.includes(
                                number
                            ) ||
                            premiumUsers.includes(
                                number + "@s.whatsapp.net"
                            )
                        ) {

                            await group.autoDemote(
                                client,
                                message
                            )

                        } else {

                            await bug(
                                message,
                                client,
                                "Commande réservée aux utilisateurs Premium.",
                                3
                            )
                        }

                        break

                    case "auto-left":

                        await react(client, message)

                        if (
                            premiumUsers.includes(
                                number
                            ) ||
                            premiumUsers.includes(
                                number + "@s.whatsapp.net"
                            )
                        ) {

                            await group.autoLeft(
                                client,
                                message
                            )

                        } else {

                            await bug(
                                message,
                                client,
                                "Commande réservée aux utilisateurs Premium.",
                                3
                            )
                        }

                        break

                    /*
                     * AUTRES
                     */

                    case "fuck":
                        await react(client, message)
                        await fuck(
                            client,
                            message
                        )
                        break

                    case "test":
                        await react(client, message)
                        break

                    default:
                        break
                }

                /*
                 * Détection des liens
                 */
                await group.linkDetection(
                    client,
                    message
                )

            } catch (error) {

                console.log(
                    "❌ Erreur traitement message :",
                    error
                )
            }
        }

    } catch (error) {

        console.log(
            "❌ Erreur générale ObameBot :",
            error
        )
    }
}

export default handleIncomingMessage