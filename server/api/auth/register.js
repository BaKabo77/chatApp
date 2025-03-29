import { pool } from "~/server/database/pool";
import bcrypt from 'bcrypt'


const saltRounds = 10

export default defineEventHandler(async (event) => {
    try {
        
        const { username, email, password } = await readBody(event)

        // Vérifier si l'email existe déjà
        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        )

        if (existingUsers.length > 0) {
            console.log('Cet email est déjà utilisé')
            throw createError({
                statusCode: 409,
                message: 'Cet email est déjà utilisé'
            })
        }

        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hashSync(password, salt)

        // Destructurer le résultat correctement
        const [result] = await pool.execute(
            'INSERT INTO users (email, password, username,avatar_url) VALUES (?, ?, ?, )',
            [email, hashedPassword, username]
        )

        // Retourner les informations pertinentes
        return {
            status: 'success',
            message: 'Inscription réussie',
        }

    } catch (error) {
        console.log(error.message)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Erreur lors de l'inscription"
        })
    }
})