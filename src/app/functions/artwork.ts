import * as functions from 'firebase-functions';
import { region, runtimeOptions } from './configs/runtime';
import { ArtworkService, UserService } from '@/services';
import TYPES from '@/src/types';
import Container from '@/src/container';
import { ErrorCode, HttpsError } from '@/app/errors';
import { Artwork } from '@/src/domain';
import { DEFAULT_PAGE_LIMIT } from '../types';
import { ICyoStatus } from '@/domain/types';
import { paginate } from './configs/paginator';
const pick = require('ramda.pick');
const isEmpty = require('ramda.isempty');
const path = require('ramda.path');

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
      const date = new Date();
      artworkData['publishedAt'] = {
        date: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear()
      };
      const artwork = Artwork.create(artworkData);
      const inserted = await service.create(artwork);
      return inserted.serialize();
    } catch (error) {
      const { code = ErrorCode.INTERNAL } = error;
      throw new HttpsError(code, error);
    }
  });

const getArtworkById = functions
  .runWith(runtimeOptions)
  .region(region)
  .https.onCall(async (data, context) => {
    try {
      const service = Container.get<ArtworkService>(TYPES.ArtworkService);
      const { id = '' } = data;
      const existed = await service.getById(id);
      if (!existed) {
        throw new HttpsError(
          ErrorCode.NOT_FOUND,
          'Cannot find information for this artwork. Please try again!'
        );
      }

      return existed.serialize();
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
        orderBy,
        filterByTime
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
      if (filterByTime && !isEmpty(filterByTime)) {
        for (const [key, value] of Object.entries(filterByTime)) {
          if (key === 'year') {
            query.push({
              [`publishedAt.${key}`]: value
            });
          } else {
            query.push({
              [`publishedAt.${key}`]: value,
              operator: 'in'
            });
          }
        }
      }

      const options = {
        limit,
        startAfter: ref as any,
        withTrashed,
        orderBy: [] as any
      };
      if (orderBy && Array.isArray(orderBy)) {
        options.orderBy = orderBy;
        if (startAfter) {
          const lastDoc = await service.getById(startAfter);
          const field = path(['0', 'field'], orderBy) || '';
          options.startAfter = (lastDoc.serialize() as any)[field] || ref;
        }
      }

      const contents = await service.query(query, options);
      const items = contents.map(c => c.serialize());

      return paginate(items, data);
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
      const items = contents.map(c => c.serialize());
      return paginate(items, data);
    } catch (error) {
      const { code = ErrorCode.INTERNAL } = error;
      throw new HttpsError(code, error);
    }
  });

const approveArtwork = functions
  .runWith(runtimeOptions)
  .region(region)
  .https.onCall(async (data, context) => {
    try {
      const service = Container.get<ArtworkService>(TYPES.ArtworkService);
      const { id = '' } = data;

      const updated = await service.updateFields(id, {
        status: ICyoStatus.APPROVED
      });

      return updated.serialize();
    } catch (error) {
      const { code = ErrorCode.INTERNAL } = error;
      throw new HttpsError(code, error);
    }
  });

const rejectArtwork = functions
  .runWith(runtimeOptions)
  .region(region)
  .https.onCall(async (data, context) => {
    try {
      const service = Container.get<ArtworkService>(TYPES.ArtworkService);
      const { id = '' } = data;

      const updated = await service.updateFields(id, {
        status: ICyoStatus.REJECTED
      });

      return updated.serialize();
    } catch (error) {
      const { code = ErrorCode.INTERNAL } = error;
      throw new HttpsError(code, error);
    }
  });

export {
  createArtwork,
  getArtworks,
  searchArtworksByContact,
  getArtworkById,
  approveArtwork,
  rejectArtwork
};
