import { provide } from 'inversify-binding-decorators';
import { Artwork } from '@/domain';
import {
  IRepository,
  IArtworkRepository
} from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';
import { NotFoundError } from '@/app/errors';

@provide(TYPES.ArtworkService)
export class ArtworkService extends BaseService<Artwork> {
  /**
   * Create CYO Gallery repository instance
   * @returns IRepository<T>
   */
  protected getBaseRepositoryInstance(): IRepository<Artwork> {
    return Container.get<IArtworkRepository>(TYPES.ArtworkRepository);
  }

  /**
   * Updates fields document
   * @param id
   * @param object fields of document
   * @returns update
   */
  async updateFields(id: string, { ...args }): Promise<Artwork> {
    const artwork = await this.getById(id);
    if (!artwork) {
      throw new NotFoundError(`CYO gallery/${id} not found`);
    }

    const artworkEntity = artwork.serialize();
    delete artworkEntity.id;

    const artworkData = Artwork.create({ ...artworkEntity, ...args });

    return this.update(id, artworkData.serialize());
  }
}
