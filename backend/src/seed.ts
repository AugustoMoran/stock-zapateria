import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Product from './models/Product';
import AdminSettings from './models/AdminSettings';
import Sale from './models/Sale';
import Return from './models/Return';
import Exchange from './models/Exchange';
import StockMovement from './models/StockMovement';
import AuditLog from './models/AuditLog';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27014/stock-zapateria');
    
    // Clear existing - TODA LA BASE DE DATOS
    await User.deleteMany({});
    await Product.deleteMany({});
    await AdminSettings.deleteMany({});
    await Sale.deleteMany({});
    await Return.deleteMany({});
    await Exchange.deleteMany({});
    await StockMovement.deleteMany({});
    await AuditLog.deleteMany({});

    if (process.argv.includes('--clear-only')) {
      console.log('Base de datos limpiada por completo (Ventas, Cambios, Devoluciones, Logs y Productos)');
      process.exit();
    }

    // Create User
    const envUsername = process.env.APP_USERNAME || 'usuario1';
    const envPassword = process.env.APP_PASSWORD || 'user123';
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(envPassword, salt);
    await User.create({
      username: envUsername,
      password: hashedPassword
    });

    // Create Admin Password
    const hashedAdminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);
    await AdminSettings.create({
      adminPasswordHash: hashedAdminPassword
    });

    console.log('Seed data created successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
