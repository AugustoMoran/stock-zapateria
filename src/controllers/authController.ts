import { Request, Response } from 'express';
import authService from '../services/authService';
import User from '../models/User';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const { _id, username: uName, accessToken, refreshToken } = await authService.login(username, password);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ _id, username: uName, accessToken });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

  try {
    const accessToken = await authService.refreshToken(refreshToken);
    res.json({ accessToken });
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = '';
      await user.save();
    }
  }
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};

export const verifyAdminPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const isValid = await authService.verifyAdminPassword(password);
    if (isValid) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid admin password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const changeAdminPassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }
    const userId = (req as any).user._id;
    const result = await authService.changeAdminPassword(currentPassword, newPassword, userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const userId = (req as any).user._id;
    const result = await authService.updateUserProfile(userId, username, password);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
