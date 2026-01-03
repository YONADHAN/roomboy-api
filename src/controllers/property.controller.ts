import { Request, Response } from 'express'
import { PropertyService } from '@/services/property.service.js'
import {
    CreatePropertySchema,
    UpdatePropertySchema,
    PropertyQuerySchema,
    UpdatePropertyStatusSchema,
} from '@/validations/property.validation.js'

const propertyService = new PropertyService()

export class PropertyController {
    async create(req: Request, res: Response) {
        const data = CreatePropertySchema.parse(req.body)
        const property = await propertyService.create(data)
        res.status(201).json(property)
    }

    async list(req: Request, res: Response) {
        const query = PropertyQuerySchema.parse(req.query)
        const result = await propertyService.getAll(query)
        res.json(result)
    }

    async getById(req: Request, res: Response) {
        const property = await propertyService.getById(req.params.id)
        if (!property) {
            return res.status(404).json({ message: 'Property not found' })
        }
        res.json(property)
    }

    async update(req: Request, res: Response) {
        const data = UpdatePropertySchema.parse(req.body)
        const property = await propertyService.update(req.params.id, data)
        res.json(property)
    }

    async updateStatus(req: Request, res: Response) {
        const { status } = UpdatePropertyStatusSchema.parse(req.body)
        const property = await propertyService.updateStatus(req.params.id, status)
        res.json(property)
    }

    async delete(req: Request, res: Response) {
        const property = await propertyService.delete(req.params.id)
        res.json({ message: 'Property deleted successfully', property })
    }
}
