import { pool } from "~/server/database/pool";

export default defineEventHandler(async (event) => {

    const { search } = await readBody(event);

    const [results] = await pool.execute('SELECT * FROM friends WHERE username LIKE ?', [`%${search}%`]);
});