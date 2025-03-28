import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user berdasarkan username
    const user = await User.findOne({ where: { Username: username } });
    if (!user) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Verifikasi password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Generate token
    const token = user.generateToken();

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.UserID,
        username: user.Username,
        name: user.Name,
        role: user.Role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat login' });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, role } = req.body;

    // Hash password
    const hashedPassword = await User.hashPassword(password);

    // Buat user baru
    const user = await User.create({
      Username: username,
      Password: hashedPassword,
      Name: name,
      Role: role || 'cs'
    });

    res.status(201).json({
      message: 'Registrasi berhasil',
      user: {
        id: user.UserID,
        username: user.Username,
        name: user.Name,
        role: user.Role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }
    res.status(500).json({ message: 'Terjadi kesalahan saat registrasi' });
  }
});

export default router;