import { Schema, model, Document, Types } from 'mongoose';

export enum MovementType {
  VENTA = 'VENTA',
  CAMBIO_ENTRADA = 'CAMBIO_ENTRADA',
  CAMBIO_SALIDA = 'CAMBIO_SALIDA',
  DEVOLUCION = 'DEVOLUCION',
  AJUSTE_MANUAL = 'AJUSTE_MANUAL',
  CARGA_INICIAL = 'CARGA_INICIAL'
}

export interface IStockMovement extends Document {
  productId: Types.ObjectId;
  talle: string;
  cantidad: number; // Positive for increase, negative for decrease
  tipo: MovementType;
  usuario: Types.ObjectId;
  fecha: Date;
  descripcion: string;
}

const stockMovementSchema = new Schema<IStockMovement>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  talle: { type: String, required: true },
  cantidad: { type: Number, required: true },
  tipo: { type: String, enum: Object.values(MovementType), required: true },
  usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now },
  descripcion: String
}, { timestamps: true });

export default model<IStockMovement>('StockMovement', stockMovementSchema);
