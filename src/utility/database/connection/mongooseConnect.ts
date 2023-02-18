const mongoose = require('mongoose')
import dotenv from 'dotenv'

dotenv.config()

export default async () => {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGOURI, {
        keepAlive: true,
    })
    return mongoose
} 