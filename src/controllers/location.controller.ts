import { Request, Response } from 'express'
import { LocationService } from '@/services/feature/location.service.js'
import {
  CreateLocationSchema,
  UpdateLocationSchema,
  LocationQuerySchema,
} from '@/validations/location.validation.js'

const locationService = new LocationService()

export class LocationController {
  async create(req: Request, res: Response) {
    const data = CreateLocationSchema.parse(req.body)
    const location = await locationService.create(data)
    res.status(201).json(location)
  }

  async list(req: Request, res: Response) {
    const query = LocationQuerySchema.parse(req.query)
    const result = await locationService.getAll(query)
    res.json(result)
  }

  async getById(req: Request, res: Response) {
    const location = await locationService.getById(req.params.id)
    if (!location) return res.status(404).json({ message: 'Not found' })
    res.json(location)
  }

  async update(req: Request, res: Response) {
    const data = UpdateLocationSchema.parse(req.body)
    const location = await locationService.update(req.params.id, data)
    res.json(location)
  }

  async toggleStatus(req: Request, res: Response) {
    const location = await locationService.toggleStatus(req.params.id)
    res.json(location)
  }

  async delete(req: Request, res: Response) {
    const location = await locationService.delete(req.params.id)
    if (!location) return res.status(404).json({ message: 'Not found' })
    res.json({ message: 'Location deleted successfully' })
  }
}
