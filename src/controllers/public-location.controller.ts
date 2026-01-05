
import { Request, Response } from 'express'
import { PublicLocationService } from '@/services/public-location.service.js'

const publicLocationService = new PublicLocationService()

export class PublicLocationController {
    async list(_req: Request, res: Response) {
        try {
            const locations = await publicLocationService.getAll()
            res.json(locations)
        } catch (error) {
            // Basic safe error handling
            console.error('Error fetching public locations:', error)
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}
