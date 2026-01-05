import { Schema, model, Document } from 'mongoose'

export interface IFieldDefinition extends Document {
  entityType: 'property' | 'product' | 'service'

  fieldKey: string // rent, price, color
  label: string // Monthly Rent
  dataType: 'string' | 'number' | 'boolean' | 'select' | 'multi-select'

  required: boolean
  options?: string[] // for select / multi-select

  rules?: {
    min?: number
    max?: number
    regex?: string
  }

  isActive: boolean
  isDeleted: boolean
  createdAt: Date
}

const FieldDefinitionSchema = new Schema<IFieldDefinition>(
  {
    entityType: {
      type: String,
      enum: ['property', 'product', 'service'],
      required: true,
    }
    ,
    fieldKey: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    dataType: {
      type: String,
      enum: ['string', 'number', 'boolean', 'select', 'multi-select'],
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    options: [String],
    rules: {
      min: Number,
      max: Number,
      regex: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

FieldDefinitionSchema.index({ entityType: 1, fieldKey: 1 }, { unique: true })

export const FieldDefinitionModel = model<IFieldDefinition>(
  'FieldDefinition',
  FieldDefinitionSchema
)
