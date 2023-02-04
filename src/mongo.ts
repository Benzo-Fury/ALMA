const mongoose = require('mongoose')
import dotenv from 'dotenv'

dotenv.config()

export default async () => {
    await mongoose.connect(process.env.MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    return mongoose
} 