import bcrypt from 'bcrypt'
import { UserModel } from '@/models/user.model.js'

export const seedAdmin = async () => {
  try {
    const adminEmail = 'yonadhanmm0@gmail.com'

    const existingAdmin = await UserModel.findOne({ email: adminEmail })

    if (existingAdmin) {
      console.log('ℹ️ Admin already exists, skipping seed')
      return
    }

    const hashedPassword = await bcrypt.hash('Yonadhan@123', 10)

    await UserModel.create({
      name: 'Yonadhan MM',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    })

    console.log('✅ Admin user created successfully')
  } catch (error) {
    console.error('❌ Failed to seed admin', error)
  }
}
