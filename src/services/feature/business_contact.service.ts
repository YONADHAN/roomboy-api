import { BusinessContactRepository } from '@/repositories/business_contact.repository.js'
import {
    CreateBusinessContactDTO,
    UpdateBusinessContactDTO,
    BusinessContactQueryDTO,
} from '@/validations/business_contact.validation.js'
import { IBusinessContact } from '@/models/business-contact.model.js'

const contactRepo = new BusinessContactRepository()

export class BusinessContactService {
    async create(data: CreateBusinessContactDTO): Promise<IBusinessContact> {
        return await contactRepo.createContact(data)
    }

    async getAll(query: BusinessContactQueryDTO) {
        return await contactRepo.getContacts(query)
    }

    async getById(id: string): Promise<IBusinessContact | null> {
        return await contactRepo.getContactById(id)
    }

    async update(id: string, data: UpdateBusinessContactDTO): Promise<IBusinessContact | null> {
        return await contactRepo.updateContact(id, data)
    }

    async toggleStatus(id: string): Promise<IBusinessContact | null> {
        const contact = await contactRepo.getContactById(id)
        if (!contact) return null

        return await contactRepo.updateContact(id, {
            isActive: !contact.isActive,
        })
    }

    async delete(id: string): Promise<IBusinessContact | null> {
        return await contactRepo.deleteContact(id)
    }
}
