import { Schema, model, Document } from 'mongoose'
import { randomUUID } from 'crypto'

export interface IProperty extends Document {
  propertyId: string
  title: string
  entityType: 'property'
  attributes: Record<string, any>
  location?: {
    city?: string
    locality?: string
    latitude?: number
    longitude?: number
  }
  images: string[]
  status: 'active' | 'blocked' | 'pending'
  isDeleted: boolean
  createdAt: Date
}

const PropertySchema = new Schema<IProperty>(
  {
    propertyId: {
      type: String,
      default: () => randomUUID(),
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    entityType: {
      type: String,
      default: 'property',
    },
    attributes: {
      type: Schema.Types.Mixed,
      default: {},
    },
    location: {
      city: String,
      locality: String,
      latitude: Number,
      longitude: Number,
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'blocked', 'pending'],
      default: 'pending',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

PropertySchema.index({
  title: 'text',
  'location.city': 1,
  'location.locality': 1,
})

export const PropertyModel = model<IProperty>('Property', PropertySchema)
