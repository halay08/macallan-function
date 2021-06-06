import * as functions from 'firebase-functions';
import { region, runtimeOptions } from './configs/runtime';
import { ArtworkService } from '@/services';
import TYPES from '@/src/types';
import Container from '@/src/container';
import { ErrorCode, HttpsError } from '@/app/errors';
import { Artwork } from '@/src/domain';
const pick = require('ramda.pick');

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

export { createArtwork };
