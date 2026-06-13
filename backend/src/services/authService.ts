import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository';
import AdminSettings from '../models/AdminSettings';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken';
import AuditLog from '../models/AuditLog';

class AuthService {
  async login(username: string, password: string) {
    let user = await userRepository.findByUsername(username);

    // Si no hay ningún usuario en la DB, intentamos validar contra el .env y crearlo
    if (!user) {
      const count = await User.countDocuments();
      if (count === 0) {
        const envUsername = process.env.APP_USERNAME || 'admin';
        const envPassword = process.env.APP_PASSWORD || 'admin123';

        if (username === envUsername && password === envPassword) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          user = await User.create({
            username: envUsername,
            password: hashedPassword
          });
        }
      }
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = generateAccessToken(user._id.toString());
      const refreshToken = generateRefreshToken(user._id.toString());

      user.refreshToken = refreshToken;
      await user.save();

      await AuditLog.create({
        usuario: user._id,
        accion: 'LOGIN',
        detalles: `Usuario ${username} inició sesión`
      });

      return {
        _id: user._id,
        username: user.username,
        accessToken,
        refreshToken
      };
    }
    throw new Error('Invalid username or password');
  }

  async refreshToken(token: string) {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;
    const user = await userRepository.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      throw new Error('Invalid refresh token');
    }

    return generateAccessToken(user._id.toString());
  }

  async updateUserProfile(userId: string, newUsername: string, newPassword?: string) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if (newUsername) {
      user.username = newUsername;
    }

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    await AuditLog.create({
      usuario: userId,
      accion: 'USER_PROFILE_UPDATE',
      detalles: `Se actualizó el perfil del usuario: ${newUsername}`
    });

    return { message: 'Profile updated successfully', username: user.username };
  }

  async verifyAdminPassword(password: string) {
    let settings = await AdminSettings.findOne();

    if (!settings) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);
      settings = await AdminSettings.create({ adminPasswordHash: hashedPassword });
    }

    return await bcrypt.compare(password, settings.adminPasswordHash);
  }

  async changeAdminPassword(currentPassword: string, newPassword: string, userId: string) {
    let settings = await AdminSettings.findOne();
    if (!settings) throw new Error('Admin settings not found');

    const isMatch = await bcrypt.compare(currentPassword, settings.adminPasswordHash);
    if (!isMatch) throw new Error('Current admin password is incorrect');

    const salt = await bcrypt.genSalt(10);
    settings.adminPasswordHash = await bcrypt.hash(newPassword, salt);
    await settings.save();

    await AuditLog.create({
      usuario: userId,
      accion: 'ADMIN_PASSWORD_CHANGE',
      detalles: 'Se cambió la contraseña administrativa'
    });

    return { message: 'Admin password changed successfully' };
  }
}

export default new AuthService();