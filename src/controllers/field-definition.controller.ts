import { Request, Response } from 'express'
import { FieldDefinitionService } from '@/services/field-definition.service.js'
import {
    CreateFieldDefinitionSchema,
    UpdateFieldDefinitionSchema,
    FieldDefinitionQuerySchema,
} from '@/validations/field-definition.validation.js'

const fieldDefinitionService = new FieldDefinitionService()

export class FieldDefinitionController {
    async create(req: Request, res: Response) {
        const data = CreateFieldDefinitionSchema.parse(req.body)
        const fieldDefinition = await fieldDefinitionService.create(data)
        res.status(201).json(fieldDefinition)
    }

    async list(req: Request, res: Response) {
        const query = FieldDefinitionQuerySchema.parse(req.query)
        const result = await fieldDefinitionService.getAll(query)
        res.json(result)
    }

    async getById(req: Request, res: Response) {
        const fieldDefinition = await fieldDefinitionService.getById(req.params.id)
        if (!fieldDefinition) {
            return res.status(404).json({ message: 'Field definition not found' })
        }
        res.json(fieldDefinition)
    }

    async update(req: Request, res: Response) {
        const data = UpdateFieldDefinitionSchema.parse(req.body)
        const fieldDefinition = await fieldDefinitionService.update(req.params.id, data)
        res.json(fieldDefinition)
    }

    async toggleStatus(req: Request, res: Response) {
        const fieldDefinition = await fieldDefinitionService.toggleStatus(req.params.id)
        res.json(fieldDefinition)
    }

    async delete(req: Request, res: Response) {
        await fieldDefinitionService.delete(req.params.id)
        res.json({ message: 'Field definition deleted successfully' })
    }
}
