import { Entity } from './entity';
import { injectable } from 'inversify';
import { IContentEntity, IThumbnail } from './types';

// Collection: contents
@injectable()
export class Content extends Entity<IContentEntity> {
  constructor(props: IContentEntity) {
    super(props);
  }

  /**
   * Creates content entity
   * @param props Content properties
   * @returns Content
   */
  public static create(props: IContentEntity): Content {
    const instance = new Content(props);
    return instance;
  }

  get id(): string {
    return this._props.id || '';
  }

  /**
   * Gets title
   */
  get title(): string {
    return this.props.title;
  }

  /**
   * Gets excerpt
   */
  get excerpt(): string | undefined {
    return this.props.excerpt;
  }

  /**
   * Gets content
   */
  get content(): string {
    return this.props.content;
  }

  /**
   * Gets img url
   */
  get imgUrl(): string {
    return this.props.imgUrl;
  }

  /**
   * Gets thumbnails
   */
  get thumbnails(): IThumbnail | undefined {
    return this.props.thumbnails;
  }

  /**
   * Gets video url
   */
  get videoUrl(): string | undefined {
    return this.props.videoUrl;
  }
}
