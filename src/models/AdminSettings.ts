import { Schema, model, Document } from 'mongoose';

export interface IAdminSettings extends Document {
  adminPasswordHash: string;
}

const adminSettingsSchema = new Schema<IAdminSettings>({
  adminPasswordHash: { type: String, required: true }
}, { timestamps: true });

export default model<IAdminSettings>('AdminSettings', adminSettingsSchema);
