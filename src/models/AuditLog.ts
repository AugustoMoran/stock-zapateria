import { Schema, model, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  usuario: Types.ObjectId;
  accion: string; // LOGIN, VENTA, CAMBIO, DEVOLUCION, STOCK_MOD, PRODUCT_CREATE, etc.
  detalles: string;
  fecha: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  usuario: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  accion: { type: String, required: true },
  detalles: { type: String },
  fecha: { type: Date, default: Date.now }
}, { timestamps: true });

export default model<IAuditLog>('AuditLog', auditLogSchema);
