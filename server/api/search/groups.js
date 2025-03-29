import { pool } from "~/server/database/pool";

export default defineEventHandler(async (event) => {

    try {
        const { search } = await readBody(event);

    const [results] = await pool.execute('SELECT * FROM conversations WHERE name LIKE ? and type = "group" ', [`%${search}%`]);

    return results;
    } catch (error) {

        console.log(error);
        throw createError({
            statusCode: 500,
            message: 'Erreur lors de la recherche des groupes'
        });
    }
});