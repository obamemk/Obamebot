import readline from 'readline'

export default async function deployAsPremium() {

    const key = "D07895461fdgdrq3ez8aaeqQ"

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    const question = (text) => {
        return new Promise(resolve => {
            rl.question(text, answer => {
                resolve(answer.trim())
            })
        })
    }

    try {

        const response = (
            await question(
                '🤖 ObameBot Premium : avez-vous une clé administrateur ? (y/n) : '
            )
        ).toLowerCase()

        if (response !== 'y') {

            console.log(
                '⚠️ ObameBot démarrera sans privilèges Premium.'
            )

            return false
        }

        const password = await question(
            '🔐 Entrez votre clé Premium : '
        )

        if (password === key) {

            console.log(
                '✅ ObameBot Premium activé avec succès !'
            )

            return true
        }

        console.log(
            '❌ Clé Premium incorrecte.'
        )

        return false

    } finally {

        rl.close()
    }
}