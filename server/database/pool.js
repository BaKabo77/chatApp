import mysql2 from 'mysql2/promise'


const config = useRuntimeConfig()

export const pool = mysql2.createPool({
    host:config.dbHost,
    database:config.dbName,
    user:config.dbUser,
    password:config.dbPassword
})
