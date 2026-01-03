import { BusinessContactModel, IBusinessContact } from '@/models/business-contact.model.js'

interface GetContactsInput {
    page: number
    limit: number
    search?: string
}

interface GetContactsOutput {
    data: IBusinessContact[]
    currentPage: number
    totalPages: number
}

export class BusinessContactRepository {
    async createContact(data: Partial<IBusinessContact>): Promise<IBusinessContact> {
        const contact = new BusinessContactModel(data)
        return await contact.save()
    }

    async getContacts(input: GetContactsInput): Promise<GetContactsOutput> {
        const { page, limit, search } = input
        const skip = (page - 1) * limit

        const query: any = {}

        if (search) {
            query.$or = [
                { displayName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { 'phoneNumbers.number': { $regex: search, $options: 'i' } },
            ]
        }

        const [data, totalCount] = await Promise.all([
            BusinessContactModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            BusinessContactModel.countDocuments(query),
        ])

        return {
            data,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit) || 1,
        }
    }

    async getContactById(id: string): Promise<IBusinessContact | null> {
        return await BusinessContactModel.findById(id)
    }

    async updateContact(
        id: string,
        data: Partial<IBusinessContact>
    ): Promise<IBusinessContact | null> {
        return await BusinessContactModel.findByIdAndUpdate(id, { $set: data }, { new: true })
    }

    async deleteContact(id: string): Promise<IBusinessContact | null> {
        return await BusinessContactModel.findByIdAndDelete(id)
    }
}
