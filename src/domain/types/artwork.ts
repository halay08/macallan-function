import { IEntity, ITimestamp } from '.';

type IThumbnail = {
  url: string;
  width: number;
  height: number;
};

type IContact = {
  email: string;
  name: string;
  age: number;
  country: string;
};

enum ICyoStatus {
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

type IPublished = {
  date: number;
  month: number;
  year: number;
};

type IArtworkEntity = IEntity &
  ITimestamp & {
    imgUrl: string;
    thumbnails?: IThumbnail;
    createdBy?: string;
    message?: string;
    contact: Partial<IContact>;
    status: ICyoStatus;
    publishedAt: IPublished;
  };

export { IArtworkEntity, IThumbnail, ICyoStatus, IContact, IPublished };
