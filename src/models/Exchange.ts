import { Schema, model, Document, Types } from 'mongoose';

export interface IExchange extends Document {
  productoDevuelto: {
    productId: Types.ObjectId;
    fabrica: string;
    articulo: string;
    color: string;
    talle: string;
    cantidad: number;
    costo: number;
  };
  productoEntregado: {
    productId: Types.ObjectId;
    fabrica: string;
    articulo: string;
    color: string;
    talle: string;
    cantidad: number;
    costo: number;
  };
  diferenciaPrecio: number;
  diferenciaCosto: number;
  usuario: Types.ObjectId;
  fecha: Date;
}

const exchangeSchema = new Schema<IExchange>({
  productoDevuelto: {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    fabrica: String,
    articulo: String,
    color: String,
    talle: String,
    cantidad: Number,
    costo: Number
  },
  productoEntregado: {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    fabrica: String,
    articulo: String,
    color: String,
    talle: String,
    cantidad: Number,
    costo: Number
  },
  diferenciaPrecio: { type: Number, default: 0 },
  diferenciaCosto: { type: Number, default: 0 },
  usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now }
}, { timestamps: true });

export default model<IExchange>('Exchange', exchangeSchema);
