import { Schema, model, Document } from 'mongoose'
import { randomUUID } from 'crypto'

export interface IBusinessContact extends Document {
  contactId: string

  displayName: string // Seller / Business name
  description?: string // Optional tagline

  phoneNumbers: {
    label: string // Primary, Sales, Support
    number: string
    isPrimary: boolean
  }[]

  email?: string

  socialLinks?: {
    platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'whatsapp'
    url: string
  }[]

  website?: string

  isActive: boolean
  createdAt: Date
}

const BusinessContactSchema = new Schema<IBusinessContact>(
  {
    contactId: {
      type: String,
      default: () => randomUUID(),
      unique: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    phoneNumbers: {
      type: [
        {
          label: { type: String, required: true },
          number: { type: String, required: true },
          isPrimary: { type: Boolean, default: false },
        },
      ],
      required: true,
    },

    email: {
      type: String,
      lowercase: true,
    },

    socialLinks: [
      {
        platform: {
          type: String,
          enum: ['facebook', 'instagram', 'twitter', 'linkedin', 'whatsapp'],
        },
        url: String,
      },
    ],

    website: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export const BusinessContactModel = model<IBusinessContact>(
  'BusinessContact',
  BusinessContactSchema
)
