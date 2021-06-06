import * as functions from 'firebase-functions';
import { region, runtimeOptions } from './configs/runtime';
import { ContentService } from '@/services';
import TYPES from '@/src/types';
import { DEFAULT_PAGE_LIMIT, DESCENDING_ORDER } from '@/app/types';
import Container from '@/src/container';
import { ErrorCode, HttpsError } from '@/app/errors';
import { Content } from '@/src/domain';
const pick = require('ramda.pick');

const createContents = functions
  .runWith(runtimeOptions)
  .region(region)
  .https.onCall(async (data, context) => {
    try {
      const service = Container.get<ContentService>(TYPES.ContentService);

      const contentData = pick(
        ['imgUrl', 'thumbnails', 'createdBy', 'message', 'contact', 'status'],
        data
      );
      const content = Content.create(contentData);
      const inserted = await service.create(content);
      return inserted.serialize();
    } catch (error) {
      const { code = ErrorCode.INTERNAL } = error;
      throw new HttpsError(code, error);
    }
  });

const getContents = functions
  .runWith(runtimeOptions)
  .region(region)
  .https.onCall(async (data, context) => {
    try {
      const service = Container.get<ContentService>(TYPES.ContentService);
      const {
        limit = DEFAULT_PAGE_LIMIT,
        startAfter,
        orderBy = { field: 'createdAt', order: DESCENDING_ORDER },
        withTrashed = false
      } = data;

      const ref = startAfter ? service.getDocumentRef(startAfter) : undefined;

      const contents = await service.getAll({
        limit,
        startAfter: ref as any,
        orderBy,
        withTrashed
      });
      return contents.map(c => c.serialize());
    } catch (error) {
      const { code = ErrorCode.INTERNAL } = error;
      throw new HttpsError(code, error);
    }
  });

export { createContents, getContents };
