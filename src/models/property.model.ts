import { Schema, model, Document } from 'mongoose'
import { randomUUID } from 'crypto'

export interface IPropertyBase {
  propertyId: string
  title: string
  entityType: 'property'
  attributes: Record<string, any>
  location: any // ObjectId
  address: {
    street?: string
    city?: string
    locality?: string
  }
  coordinates: {
    lat: number
    lng: number
  }
  images: string[]
  status: 'active' | 'blocked' | 'pending'
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IProperty extends IPropertyBase, Document { }

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
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    address: {
      street: String,
      city: String, // Cached for easier display if needed
      locality: String,
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
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
  'address.city': 1,
  'address.locality': 1,
})

export const PropertyModel = model<IProperty>('Property', PropertySchema)
