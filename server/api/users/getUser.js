import { pool } from "~/server/database/pool";

export default defineEventHandler(async (event) => {
    try {
        const session = await getUserSession(event)
        
        if (!session.user) {
            throw createError({
                statusCode: 401,
                message: "Utilisateur non authentifié"
            })
        }

        const [result] = await pool.execute(
            'SELECT id, email, username, avatar_url, created_at, last_login FROM users WHERE id = ?',
            [session.user.id]
        )

        if (result.length === 0) {
            throw createError({
                statusCode: 404,
                message: "Utilisateur non trouvé"
            })
        }

        return {
            statusCode: 200,
            data: {
                id: result[0].id,
                email: result[0].email,
                username: result[0].username,
                avatarUrl: result[0].avatar_url,
                createdAt: result[0].created_at,
                lastLogin: result[0].last_login
            }
        }

    } catch (error) {
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Erreur lors de la récupération des données"
        })
    }
})