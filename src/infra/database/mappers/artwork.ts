import { Artwork } from '@/domain';

/**
 * Artwork mapper
 */
export class ArtworkMapper {
  static toDomain(raw: any): Artwork {
    return Artwork.create({
      id: raw.id,

      imgUrl: raw.imgUrl,

      thumbnails: raw.thumbnails,

      createdBy: raw.createdBy,

      message: raw.message,

      contact: raw.contact,

      status: raw.status,

      createdAt: raw.createdAt,

      updatedAt: raw.updatedAt,

      deletedAt: raw.deletedAt
    });
  }
}
