import { Content } from '@/domain';

/**
 * Content mapper
 */
export class ContentMapper {
  static toDomain(raw: any): Content {
    return Content.create({
      id: raw.id,

      title: raw.title,

      excerpt: raw.excerpt,

      content: raw.content,

      imgUrl: raw.imgUrl,

      thumbnails: raw.thumbnails,

      videoUrl: raw.videoUrl,

      createdAt: raw.createdAt,

      updatedAt: raw.updatedAt,

      deletedAt: raw.deletedAt
    });
  }
}
