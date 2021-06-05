import { provide } from 'inversify-binding-decorators';
import { User } from '@/domain';
import { UserMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { IUserRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { IUserEntity } from '@/src/domain/types';

@provide(TYPES.UserRepository)
export default class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  /**
   * Gets collection
   * @returns
   */
  getCollectionName() {
    return COLLECTIONS.User;
  }

  /**
   * Map fields to domain entity
   * @param item Entity raw field
   * @returns domain
   */
  protected toDomain(item: User): User {
    return UserMapper.toDomain(item);
  }

  /**
   * Serialize domain entity
   * @param item Entity object
   * @returns serialize
   */
  protected serialize(item: User): IUserEntity {
    return item.serialize();
  }
}
