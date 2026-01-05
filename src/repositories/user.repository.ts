import { IUser, UserModel } from '@/models/user.model.js'

export class UserRepository {
  async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(data)
    return await user.save()
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email })
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id)
  }
}
