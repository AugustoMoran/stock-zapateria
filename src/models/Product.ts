import { Schema, model, Document } from 'mongoose';

export interface IStock {
  '5': number;
  '6': number;
  '7': number;
  '8': number;
  '9': number;
  '0': number;
  '1': number;
}

export interface IProduct extends Document {
  fabrica: string;
  articulo: string;
  color: string;
  costo: number;
  precioPublico: number;
  stock: IStock;
}

const productSchema = new Schema<IProduct>({
  fabrica: { type: String, required: true },
  articulo: { type: String, required: true },
  color: { type: String, required: true },
  costo: { type: Number, required: true },
  precioPublico: { type: Number, required: true },
  stock: {
    '5': { type: Number, default: 0 },
    '6': { type: Number, default: 0 },
    '7': { type: Number, default: 0 },
    '8': { type: Number, default: 0 },
    '9': { type: Number, default: 0 },
    '0': { type: Number, default: 0 },
    '1': { type: Number, default: 0 },
  }
}, { timestamps: true });

// A product is defined by fabrica + articulo + color
productSchema.index({ fabrica: 1, articulo: 1, color: 1 }, { unique: true });

export default model<IProduct>('Product', productSchema);
