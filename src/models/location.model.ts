import { Schema, model, Document } from 'mongoose'

export interface ILocation extends Document {
  name: string
  city: string
  slug: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const LocationSchema = new Schema<ILocation>(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const LocationModel = model<ILocation>('Location', LocationSchema)
