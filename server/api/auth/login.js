import { pool } from "~/server/database/pool";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export default defineEventHandler(async(event)=>{

    try{

        const {email,password} = await readBody(event)
        const config = useRuntimeConfig()

        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        )

        console.log(existingUsers)

        if (existingUsers.length === 0) {
            console.log("Cet email n'existe pas")
            throw createError({
                statusCode: 409,
                message: "Cet email n'existe pas"
            })
        }

        const request = await pool.execute('select * from users where email = ?',[email])

        const user = request[0][0]
        const hashedPassword = request[0][0].password

        const isPasswordCorrect = await bcrypt.compare(password,hashedPassword)

        if(!isPasswordCorrect){
            console.log('mauvais mdp')
            throw createError({
                statusCode:401,
                message:'mauvais mot de passe'
            })
        }

        const token = jwt.sign(
            user,
            config.jwtSecret,
            {expiresIn:'1h'}
        )

        await setUserSession(event,{

            user:{
                id:user.id,
                email:user.email,
                username:user.username,
                avatarUrl:user.avatar_url,
                createdAt:user.created_at,
                lastLogin:user.last_login
            },

            secure:{
                token:token
            }

        })

        return{
            statusCode:200,
            message:"identifiants correctes",
            token:token,
            data:{
                id:user.id,
                email:user.email,
                username:user.username,
                avatarUrl:user.avatar_url,
                createdAt:user.created_at,
                lastLogin:user.last_login
            }
        }

    }catch(error){

        console.log(error.message)

        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "Erreur lors de la connexion"
        })
    }
})