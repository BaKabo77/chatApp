import { pool } from "~/server/database/pool";

export default defineEventHandler(async (event) => {

   try {
    const { search } = await readBody(event);

    const [results] = await pool.execute('SELECT id,email,username,avatar_url,created_at,last_login,is_online,description FROM users WHERE username LIKE ?', [`%${search}%`]);

    return results;
   } catch (error) {

    console.log(error);
    throw createError({
        statusCode: 500,
        message: 'Erreur lors de la recherche des utilisateurs'
    });
   }
});
