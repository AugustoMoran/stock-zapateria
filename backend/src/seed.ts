import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User';
import Product from './models/Product';
import AdminSettings from './models/AdminSettings';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27014/stock-zapateria');
    
    // Clear existing
    await User.deleteMany({});
    await Product.deleteMany({});
    await AdminSettings.deleteMany({});

    if (process.argv.includes('--clear-only')) {
      console.log('Base de datos limpiada por completo');
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

    // Create Products
    const products = [
      {
        fabrica: 'Nike',
        articulo: 'Air Max',
        color: 'Negro',
        costo: 5000,
        precioPublico: 12000,
        stock: { '5': 10, '6': 5, '7': 12, '8': 8, '9': 4, '0': 6, '1': 2 }
      },
      {
        fabrica: 'Adidas',
        articulo: 'Superstar',
        color: 'Blanco',
        costo: 4500,
        precioPublico: 11000,
        stock: { '5': 8, '6': 10, '7': 15, '8': 5, '9': 3, '0': 4, '1': 1 }
      },
      {
        fabrica: 'Puma',
        articulo: 'Suede',
        color: 'Azul',
        costo: 4000,
        precioPublico: 9500,
        stock: { '5': 5, '6': 5, '7': 5, '8': 5, '9': 5, '0': 5, '1': 5 }
      }
    ];

    await Product.insertMany(products);

    console.log('Seed data created successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
