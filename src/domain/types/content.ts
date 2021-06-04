import { IEntity, ITimestamp, IThumbnail } from '.';

type IContentEntity = IEntity &
  ITimestamp & {
    title: string;
    excerpt?: string;
    content: string;
    imgUrl: string;
    thumbnails?: IThumbnail;
    videoUrl?: string;
  };

export { IContentEntity };
