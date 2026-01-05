import { Schema, model, Document } from 'mongoose'

export interface ILocation extends Document {
  name: string
  city: string
  state: string
  slug: string
  isActive: boolean
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

const LocationSchema = new Schema<ILocation>(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const LocationModel = model<ILocation>('Location', LocationSchema)
