import {
  BusinessContactModel,
  IBusinessContact,
} from '@/models/business-contact.model.js'

export class BusinessContactRepository {
  // CREATE (only once)
  async createBusinessContact(
    data: Partial<IBusinessContact>
  ): Promise<IBusinessContact> {
    const existingContact = await BusinessContactModel.findOne()

    if (existingContact) {
      throw new Error('Business contact already exists')
    }

    const contact = new BusinessContactModel(data)
    return await contact.save()
  }

  // GET SINGLE BUSINESS CONTACT
  async getBusinessContact(): Promise<IBusinessContact | null> {
    return await BusinessContactModel.findOne({ isActive: true })
  }

  // UPDATE BUSINESS CONTACT
  async updateBusinessContact(
    data: Partial<IBusinessContact>
  ): Promise<IBusinessContact | null> {
    const existingContact = await BusinessContactModel.findOne()

    if (!existingContact) {
      throw new Error('Business contact not found')
    }

    return await BusinessContactModel.findOneAndUpdate(
      { _id: existingContact._id },
      { $set: data },
      { new: true }
    )
  }
}
