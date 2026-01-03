import { Request, Response } from 'express'
import { BusinessContactService } from '@/services/feature/business_contact.service.js'
import {
    CreateBusinessContactSchema,
    UpdateBusinessContactSchema,
    BusinessContactQuerySchema,
} from '@/validations/business_contact.validation.js'

const contactService = new BusinessContactService()

export class BusinessContactController {
    async create(req: Request, res: Response) {
        const data = CreateBusinessContactSchema.parse(req.body)
        const contact = await contactService.create(data)
        res.status(201).json(contact)
    }

    async list(req: Request, res: Response) {
        const query = BusinessContactQuerySchema.parse(req.query)
        const result = await contactService.getAll(query)
        res.json(result)
    }

    async getById(req: Request, res: Response) {
        const contact = await contactService.getById(req.params.id)
        if (!contact) return res.status(404).json({ message: 'Not found' })
        res.json(contact)
    }

    async update(req: Request, res: Response) {
        const data = UpdateBusinessContactSchema.parse(req.body)
        const contact = await contactService.update(req.params.id, data)
        res.json(contact)
    }

    async toggleStatus(req: Request, res: Response) {
        const contact = await contactService.toggleStatus(req.params.id)
        res.json(contact)
    }

    async delete(req: Request, res: Response) {
        await contactService.delete(req.params.id)
        res.status(204).send()
    }
}
