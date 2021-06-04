import { Entity } from './entity';
import { injectable } from 'inversify';
import { IArtworkEntity, ICyoStatus, IContact, IThumbnail } from './types';

// Collection: artwork
@injectable()
export class Artwork extends Entity<IArtworkEntity> {
  constructor(props: IArtworkEntity) {
    super(props);
  }

  /**
   * Creates CYO gallery entity
   * @param props Artwork properties
   * @returns Artwork
   */
  public static create(props: IArtworkEntity): Artwork {
    const instance = new Artwork(props);
    return instance;
  }

  get id(): string {
    return this._props.id || '';
  }

  /**
   * Gets img url
   */
  get imgUrl(): string {
    return this.props.imgUrl || '';
  }

  /**
   * Gets thumbnail objects
   */
  get thumbnails(): IThumbnail | undefined {
    return this.props.thumbnails;
  }

  /**
   * Author of CYO
   */
  get createdBy(): string | undefined {
    return this.props.createdBy;
  }

  /**
   * Personal message of CYO owner
   */
  get message(): string | undefined {
    return this.props.message;
  }

  /**
   * Gets contact
   */
  get contact(): Partial<IContact> {
    return this.props.contact;
  }

  /**
   * Gets status
   */
  get status(): ICyoStatus {
    return this.props.status;
  }
}
