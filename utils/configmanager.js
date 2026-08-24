import fs from 'fs'

// Chemins des fichiers de configuration
console.log('Initialisation de la configuration ObameBot...')

const configPath = 'config.json'
const premiumPath = 'db.json'

// Chargement de la configuration au démarrage
let config = {}

if (fs.existsSync(configPath)) {
    console.log('Fichier config.json trouvé... lecture...')

    try {
        config = JSON.parse(
            fs.readFileSync(configPath, 'utf-8')
        )

        console.log('Configuration chargée avec succès !')
    } catch (e) {
        console.log(
            'Erreur lors de la lecture de config.json.'
        )

        config = { users: {} }
    }
} else {
    console.log(
        'config.json introuvable... création d’une configuration vide.'
    )

    config = { users: {} }
}

// Sauvegarde de la configuration
const saveConfig = () => {
    console.log('Sauvegarde de la configuration...')

    fs.writeFileSync(
        configPath,
        JSON.stringify(config, null, 2)
    )

    console.log('Configuration sauvegardée avec succès !')
}

// Gestion des utilisateurs Premium
let premiums = {}

if (fs.existsSync(premiumPath)) {
    console.log('db.json trouvé... lecture...')

    try {
        premiums = JSON.parse(
            fs.readFileSync(premiumPath, 'utf-8')
        )

        console.log(
            'Utilisateurs Premium chargés avec succès !'
        )
    } catch (e) {
        console.log(
            'Erreur lors de la lecture de db.json.'
        )

        premiums = { premiumUser: {} }
    }
} else {
    premiums = { premiumUser: {} }

    console.log(
        'db.json introuvable... création d’une base Premium vide.'
    )
}

// Sauvegarde des utilisateurs Premium
const savePremium = () => {
    console.log('Sauvegarde des utilisateurs Premium...')

    fs.writeFileSync(
        premiumPath,
        JSON.stringify(premiums, null, 2)
    )

    console.log(
        'Utilisateurs Premium sauvegardés avec succès !'
    )
}

export default {
    config,
    premiums,

    saveP() {
        savePremium()
    },

    save() {
        saveConfig()
    }
}