import mongoose from 'mongoose';
import AdminSettings from '../models/AdminSettings';
import AuditLog from '../models/AuditLog';
import Exchange from '../models/Exchange';
import Product from '../models/Product';
import Return from '../models/Return';
import Sale from '../models/Sale';
import StockMovement from '../models/StockMovement';
import User from '../models/User';

export const models = {
  AdminSettings,
  AuditLog,
  Exchange,
  Product,
  Return,
  Sale,
  StockMovement,
  User
};
