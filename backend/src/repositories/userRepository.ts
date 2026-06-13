import User, { IUser } from '../models/User';

class UserRepository {
  async findByUsername(username: string) {
    return await User.findOne({ username });
  }

  async findById(id: string) {
    return await User.findById(id);
  }

  async update(id: string, data: Partial<IUser>) {
    return await User.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new UserRepository();