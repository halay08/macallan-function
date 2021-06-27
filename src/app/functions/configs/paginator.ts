import { IEntity } from '@/domain/types';

type Response<T> = {
  pagination: {
    lastRef: string;

    totalItemOfPage?: number;
  };

  items: T[];

  option?: any;
};

export const paginate = <T extends IEntity>(
  items: T[],
  option?: any
): Response<T> => {
  const totalItemOfPage = items.length;
  return {
    pagination: {
      lastRef: items[totalItemOfPage - 1]?.id || '',
      totalItemOfPage
    },
    option,
    items
  };
};
