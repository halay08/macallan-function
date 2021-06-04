import { provide } from 'inversify-binding-decorators';
import { Content } from '@/domain';
import {
  IRepository,
  IContentRepository
} from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';
import { NotFoundError } from '@/app/errors';

@provide(TYPES.ContentService)
export class ContentService extends BaseService<Content> {
  /**
   * Create Content repository instance
   * @returns IRepository<T>
   */
  protected getBaseRepositoryInstance(): IRepository<Content> {
    return Container.get<IContentRepository>(TYPES.ContentRepository);
  }

  /**
   * Updates fields document
   * @param id
   * @param object fields of document
   * @returns update
   */
  async updateFields(id: string, { ...args }): Promise<Content> {
    const content = await this.getById(id);
    if (!content) {
      throw new NotFoundError(`CYO gallery/${id} not found`);
    }

    const contentEntity = content.serialize();
    delete contentEntity.id;

    const contentData = Content.create({ ...contentEntity, ...args });

    return this.update(id, contentData.serialize());
  }
}
