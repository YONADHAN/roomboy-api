import { LocationModel, ILocation } from '@/models/location.model.js'

interface GetLocationsInput {
  page: number
  limit: number
  search?: string
  isActive?: boolean
  isDeleted?: boolean
}

interface GetLocationsOutput {
  data: ILocation[]
  currentPage: number
  totalPages: number
}

export class LocationRepository {
  async createLocation(data: Partial<ILocation>): Promise<ILocation> {
    const location = new LocationModel(data)
    return await location.save()
  }

  async getLocations(input: GetLocationsInput): Promise<GetLocationsOutput> {
    const { page, limit, search, isActive, isDeleted } = input
    const skip = (page - 1) * limit

    const query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ]
    }

    if (isActive !== undefined) {
      query.isActive = isActive
    }

    // Default filter: exclude deleted unless explicitly asked (or isDeleted filter is handled)
    // If isDeleted is strictly provided, use it. Else default to false.
    if (isDeleted !== undefined) {
      query.isDeleted = isDeleted
    } else {
      query.isDeleted = { $ne: true }
    }

    const [data, totalCount] = await Promise.all([
      LocationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      LocationModel.countDocuments(query),
    ])

    return {
      data,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit) || 1,
    }
  }

  async getLocationById(id: string): Promise<ILocation | null> {
    return await LocationModel.findById(id)
  }

  async getLocationBySlug(slug: string): Promise<ILocation | null> {
    return await LocationModel.findOne({ slug, isDeleted: { $ne: true } })
  }

  async updateLocation(
    id: string,
    data: Partial<ILocation>
  ): Promise<ILocation | null> {
    return await LocationModel.findByIdAndUpdate(id, { $set: data }, { new: true })
  }

  async softDeleteLocation(id: string): Promise<ILocation | null> {
    return await LocationModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true })
  }
}
