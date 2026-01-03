import { Request, Response } from 'express'
import { PublicPropertyService } from '@/services/public-property.service.js'
import {
    PublicPropertyQuerySchema,
    PublicFieldDefinitionQuerySchema,
} from '@/validations/public-property.validation.js'

const publicPropertyService = new PublicPropertyService()

export class PublicPropertyController {
    async list(req: Request, res: Response) {
        const query = PublicPropertyQuerySchema.parse(req.query)
        const result = await publicPropertyService.getAll(query, req.query)
        res.json(result)
    }

    async getById(req: Request, res: Response) {
        const property = await publicPropertyService.getById(req.params.id)
        if (!property) {
            return res.status(404).json({ message: 'Property not found' })
        }
        res.json(property)
    }

    async getBySlug(req: Request, res: Response) {
        const property = await publicPropertyService.getBySlug(req.params.slug)
        if (!property) {
            return res.status(404).json({ message: 'Property not found' })
        }
        res.json(property)
    }

    async getFieldDefinitions(req: Request, res: Response) {
        const { entityType } = PublicFieldDefinitionQuerySchema.parse(req.query)
        const fieldDefinitions = await publicPropertyService.getFieldDefinitions(entityType)
        res.json(fieldDefinitions)
    }
}
