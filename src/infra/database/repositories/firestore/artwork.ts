import { provide } from 'inversify-binding-decorators';
import { Artwork } from '@/domain';
import { ArtworkMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { IArtworkRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { IArtworkEntity } from '@/src/domain/types';

@provide(TYPES.ArtworkRepository)
export default class ArtworkRepository
  extends BaseRepository<Artwork>
  implements IArtworkRepository {
  /**
   * Gets collection
   * @returns
   */
  getCollectionName() {
    return COLLECTIONS.Artwork;
  }

  /**
   * Map fields to domain entity
   * @param item Entity raw field
   * @returns domain
   */
  protected toDomain(item: Artwork): Artwork {
    return ArtworkMapper.toDomain(item);
  }

  /**
   * Serialize domain entity
   * @param item Entity object
   * @returns serialize
   */
  protected serialize(item: Artwork): IArtworkEntity {
    return item.serialize();
  }
}
