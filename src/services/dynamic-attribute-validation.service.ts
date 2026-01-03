import { FieldDefinitionModel } from '@/models/field-definition.model.js'

export class DynamicAttributeValidationService {
  async validate(
    entityType: 'property' | 'product' | 'service',
    attributes: Record<string, any>
  ): Promise<void> {
    // 1️⃣ Fetch all active field definitions for this entity
    const fieldDefinitions = await FieldDefinitionModel.find({
      entityType,
      isActive: true,
    })

    // Convert to map for fast lookup
    const fieldMap = new Map(
      fieldDefinitions.map((field) => [field.fieldKey, field])
    )

    // 2️⃣ Check required fields
    for (const field of fieldDefinitions) {
      if (field.required && attributes[field.fieldKey] === undefined) {
        throw new Error(`"${field.label}" is required`)
      }
    }

    // 3️⃣ Validate provided attributes
    for (const [key, value] of Object.entries(attributes)) {
      const field = fieldMap.get(key)

      if (!field) {
        throw new Error(`"${key}" is not a valid field`)
      }

      this.validateFieldValue(field, value)
    }
  }

  private validateFieldValue(field: any, value: any) {
    switch (field.dataType) {
      case 'string':
        if (typeof value !== 'string') {
          throw new Error(`"${field.label}" must be a string`)
        }
        this.applyStringRules(field, value)
        break

      case 'number':
        if (typeof value !== 'number') {
          throw new Error(`"${field.label}" must be a number`)
        }
        this.applyNumberRules(field, value)
        break

      case 'boolean':
        if (typeof value !== 'boolean') {
          throw new Error(`"${field.label}" must be boolean`)
        }
        break

      case 'select':
        if (!field.options?.includes(value)) {
          throw new Error(
            `"${field.label}" must be one of: ${field.options?.join(', ')}`
          )
        }
        break

      case 'multi-select':
        if (!Array.isArray(value)) {
          throw new Error(`"${field.label}" must be an array`)
        }
        for (const item of value) {
          if (!field.options?.includes(item)) {
            throw new Error(
              `"${item}" is not a valid option for "${field.label}"`
            )
          }
        }
        break

      default:
        throw new Error(`Unsupported data type for "${field.label}"`)
    }
  }

  private applyNumberRules(field: any, value: number) {
    if (field.rules?.min !== undefined && value < field.rules.min) {
      throw new Error(`"${field.label}" must be at least ${field.rules.min}`)
    }

    if (field.rules?.max !== undefined && value > field.rules.max) {
      throw new Error(`"${field.label}" must be at most ${field.rules.max}`)
    }
  }

  private applyStringRules(field: any, value: string) {
    if (field.rules?.regex) {
      const regex = new RegExp(field.rules.regex)
      if (!regex.test(value)) {
        throw new Error(`"${field.label}" format is invalid`)
      }
    }
  }
}
