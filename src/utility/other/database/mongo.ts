import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export default async () => {
    await mongoose.connect(process.env.MONGOURI || '', {
        keepAlive: true
    })
    return mongoose
} 