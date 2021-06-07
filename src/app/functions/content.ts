import * as functions from 'firebase-functions';
import { region, runtimeOptions } from './configs/runtime';
import { ContentService } from '@/services';
import TYPES from '@/src/types';
import { DEFAULT_PAGE_LIMIT } from '@/app/types';
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
        withTrashed = false
      } = data;

      const ref = startAfter ? service.getDocumentRef(startAfter) : undefined;

      const contents = await service.getAll({
        limit,
        startAfter: ref as any,
        withTrashed
      });
      return contents.map(c => c.serialize());
    } catch (error) {
      const { code = ErrorCode.INTERNAL } = error;
      throw new HttpsError(code, error);
    }
  });

const getContentById = functions
  .runWith(runtimeOptions)
  .region(region)
  .https.onCall(async (data, context) => {
    try {
      const service = Container.get<ContentService>(TYPES.ContentService);
      const { id = '' } = data;

      const content = await service.getById(id);
      if (!content) {
        throw new HttpsError(
          ErrorCode.NOT_FOUND,
          'This content does not exist or has been removed!'
        );
      }

      return content.serialize();
    } catch (error) {
      const { code = ErrorCode.INTERNAL } = error;
      throw new HttpsError(code, error);
    }
  });

const getContentByTitle = functions
  .runWith(runtimeOptions)
  .region(region)
  .https.onCall(async (data, context) => {
    try {
      const service = Container.get<ContentService>(TYPES.ContentService);
      const { title = '' } = data;

      const [content] = await service.findBy('title', title);
      if (!content) {
        throw new HttpsError(
          ErrorCode.NOT_FOUND,
          'This content does not exist or has been removed!'
        );
      }

      return content.serialize();
    } catch (error) {
      const { code = ErrorCode.INTERNAL } = error;
      throw new HttpsError(code, error);
    }
  });

export { createContents, getContents, getContentById, getContentByTitle };
