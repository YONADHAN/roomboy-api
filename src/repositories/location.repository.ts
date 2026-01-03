import { LocationModel, ILocation } from '@/models/location.model.js'

interface GetLocationsInput {
  page: number
  limit: number
  search?: string
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
    const { page, limit, search } = input
    const skip = (page - 1) * limit

    const query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ]
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

  async updateLocation(
    id: string,
    data: Partial<ILocation>
  ): Promise<ILocation | null> {
    return await LocationModel.findByIdAndUpdate(id, { $set: data }, { new: true })
  }
}
