import 'dotenv/config' // 👈 Load env vars BEFORE everything else
import app from '@/app.js'
import { connectDB } from '@/config/db.js'
import { seedAdmin } from './services/admin.seed'

const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDB()
  await seedAdmin()
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}

startServer()
