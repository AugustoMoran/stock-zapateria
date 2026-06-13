import { Schema, model, Document, Types } from 'mongoose';

export interface IReturn extends Document {
  productId: Types.ObjectId;
  fabrica: string;
  articulo: string;
  color: string;
  talle: string;
  cantidad: number;
  montoDevuelto: number;
  costoUnitario: number;
  usuario: Types.ObjectId;
  fecha: Date;
}

const returnSchema = new Schema<IReturn>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  fabrica: String,
  articulo: String,
  color: String,
  talle: String,
  cantidad: { type: Number, required: true },
  montoDevuelto: { type: Number, required: true },
  costoUnitario: { type: Number, required: true, default: 0 },
  usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now }
}, { timestamps: true });

export default model<IReturn>('Return', returnSchema);
