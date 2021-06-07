import * as functions from 'firebase-functions';
import { region, runtimeOptions } from './configs/runtime';
import { ArtworkService, UserService } from '@/services';
import TYPES from '@/src/types';
import Container from '@/src/container';
import { ErrorCode, HttpsError } from '@/app/errors';
import { Artwork } from '@/src/domain';
import { DEFAULT_PAGE_LIMIT } from '../types';
const pick = require('ramda.pick');
const isEmpty = require('ramda.isempty');

const createArtwork = functions
  .runWith(runtimeOptions)
  .region(region)
  .https.onCall(async (data, context) => {
    try {
      const service = Container.get<ArtworkService>(TYPES.ArtworkService);
      const { imgUrl } = data;
      const [existed] = await service.findBy('imgUrl', imgUrl);
      if (existed) {
        throw new HttpsError(
          ErrorCode.ALREADY_EXISTS,
          'This image name already exists. Change its name and try again!'
        );
      }

      const artworkData = pick(
        ['imgUrl', 'thumbnails', 'createdBy', 'message', 'contact', 'status'],
        data
      );
      const artwork = Artwork.create(artworkData);
      const inserted = await service.create(artwork);
      return inserted.serialize();
    } catch (error) {
      const { code = ErrorCode.INTERNAL } = error;
      throw new HttpsError(code, error);
    }
  });

const getArtworks = functions
  .runWith(runtimeOptions)
  .region(region)
  .https.onCall(async (data, context) => {
    try {
      const service = Container.get<ArtworkService>(TYPES.ArtworkService);
      const {
        limit = DEFAULT_PAGE_LIMIT,
        startAfter,
        withTrashed = false,
        status,
        createdBy,
        orderBy
      } = data;

      const ref = startAfter ? service.getDocumentRef(startAfter) : undefined;

      const query = [];
      if (status) {
        query.push({ status });
      }
      if (createdBy) {
        const userService = Container.get<UserService>(TYPES.UserService);
        query.push({
          createdBy: userService.getDocumentRef(createdBy)
        });
      }

      const options = {
        limit,
        startAfter: ref as any,
        withTrashed,
        orderBy: [] as any
      };
      if (orderBy && Array.isArray(orderBy)) {
        options.orderBy = orderBy;
      }

      const contents = await service.query(query, options);
      return contents.map(c => c.serialize());
    } catch (error) {
      const { code = ErrorCode.INTERNAL } = error;
      throw new HttpsError(code, error);
    }
  });

const searchArtworksByContact = functions
  .runWith(runtimeOptions)
  .region(region)
  .https.onCall(async (data, context) => {
    try {
      const service = Container.get<ArtworkService>(TYPES.ArtworkService);
      const {
        limit = DEFAULT_PAGE_LIMIT,
        startAfter,
        withTrashed = false,
        status,
        contact
      } = data;

      const ref = startAfter ? service.getDocumentRef(startAfter) : undefined;

      const query = [];
      if (status) {
        query.push({ status });
      }

      if (contact && !isEmpty(contact)) {
        if (contact.field == 'age') {
          query.push({
            [`contact.${contact.field}`]: contact.value
          });
        } else {
          query.push({
            [`contact.${contact.field}`]: contact.value,
            operator: '>='
          });
          query.push({
            [`contact.${contact.field}`]: contact.value + '\uf8ff',
            operator: '<='
          });
        }
      }

      const contents = await service.query(query, {
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

export { createArtwork, getArtworks, searchArtworksByContact };
