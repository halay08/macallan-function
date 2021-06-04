import { provide } from 'inversify-binding-decorators';
import { Content } from '@/domain';
import { ContentMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { IContentRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { IContentEntity } from '@/src/domain/types';

@provide(TYPES.ContentRepository)
export default class ContentRepository
  extends BaseRepository<Content>
  implements IContentRepository {
  /**
   * Gets collection
   * @returns
   */
  getCollectionName() {
    return COLLECTIONS.Content;
  }

  /**
   * Map fields to domain entity
   * @param item Entity raw field
   * @returns domain
   */
  protected toDomain(item: Content): Content {
    return ContentMapper.toDomain(item);
  }

  /**
   * Serialize domain entity
   * @param item Entity object
   * @returns serialize
   */
  protected serialize(item: Content): IContentEntity {
    return item.serialize();
  }
}
