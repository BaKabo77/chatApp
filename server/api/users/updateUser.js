import { pool } from "~/server/database/pool"
import bcrypt from 'bcrypt'

const saltRounds = 10

export default defineEventHandler(async (event) => {
    try {
        // Récupérer les données de la requête
        const { username, email, description, currentPassword, newPassword } = await readBody(event)
        
        // Récupérer la session utilisateur
        const session = await getUserSession(event)
        if (!session?.user) {
            throw createError({
                statusCode: 401,
                message: 'Non autorisé'
            })
        }

        const userId = session.user.id

        // Vérifier si l'email existe déjà (sauf si c'est le même utilisateur)
        if (email) {
            const [existingUsers] = await pool.execute(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, userId]
            )

            if (existingUsers.length > 0) {
                throw createError({
                    statusCode: 409,
                    message: 'Cet email est déjà utilisé'
                })
            }
        }

        // Si changement de mot de passe demandé
        if (currentPassword && newPassword) {
            // Vérifier le mot de passe actuel
            const [user] = await pool.execute(
                'SELECT password FROM users WHERE id = ?',
                [userId]
            )

            const isPasswordCorrect = await bcrypt.compare(
                currentPassword,
                user[0].password
            )

            if (!isPasswordCorrect) {
                throw createError({
                    statusCode: 401,
                    message: 'Mot de passe actuel incorrect'
                })
            }

            // Hasher le nouveau mot de passe
            const salt = await bcrypt.genSalt(saltRounds)
            const hashedNewPassword = await bcrypt.hash(newPassword, salt)

            // Mettre à jour le mot de passe
            await pool.execute(
                'UPDATE users SET password = ? WHERE id = ?',
                [hashedNewPassword, userId]
            )
        }

        // Construire la requête de mise à jour des informations de profil
        let updateQuery = 'UPDATE users SET'
        const updateValues = []
        const updateFields = []

        if (username) {
            updateFields.push(' username = ?')
            updateValues.push(username)
        }
        if (email) {
            updateFields.push(' email = ?')
            updateValues.push(email)
        }
        if (description !== undefined) { // Permettre une description vide
            updateFields.push(' description = ?')
            updateValues.push(description)
        }

        // Si aucune donnée à mettre à jour
        if (updateFields.length === 0 && !currentPassword) {
            throw createError({
                statusCode: 400,
                message: 'Aucune donnée à mettre à jour'
            })
        }

        // Mettre à jour les informations de profil si nécessaire
        if (updateFields.length > 0) {
            updateQuery += updateFields.join(',') + ' WHERE id = ?'
            updateValues.push(userId)

            await pool.execute(updateQuery, updateValues)
        }

        // Récupérer les données mises à jour
        const [updatedUser] = await pool.execute(
            'SELECT id, email, username, avatar_url, description, created_at, last_login FROM users WHERE id = ?',
            [userId]
        )

        return {
            statusCode: 200,
            message: 'Informations mises à jour avec succès',
            data: {
                id: updatedUser[0].id,
                email: updatedUser[0].email,
                username: updatedUser[0].username,
                avatarUrl: updatedUser[0].avatar_url,
                description: updatedUser[0].description,
                createdAt: updatedUser[0].created_at,
                lastLogin: updatedUser[0].last_login
            }
        }

    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || 'Erreur lors de la mise à jour des informations'
        })
    }
})