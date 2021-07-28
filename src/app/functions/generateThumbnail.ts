import * as functions from 'firebase-functions';
import { admin } from '@/src/firebase.config';
import { spawn, execFile } from 'child-process-promise';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { ArtworkService } from '../services/artwork';
import TYPES from '@/src/types';
import Container from '@/src/container';
import { IThumbnail } from '@/src/domain/types';
import { v4 as uuidv4 } from 'uuid';

// [START generateThumbnail]
/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
// [START generateThumbnailTrigger]

const generateThumbnail = functions.storage
  .object()
  .onFinalize(async object => {
    const {
      bucket: fileBucket = '',
      name: filePath = '',
      contentType = ''
    } = object;

    const thumbPath = '_thumbs';

    // [START stopConditions]
    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith('image/')) {
      return functions.logger.log('This is not an image.');
    }

    // Get the file name.
    const fileName = path.basename(filePath);
    // Exit if the image is already a thumbnail.
    if (fileName.includes('thumb@')) {
      return functions.logger.log('Already a Thumbnail.');
    }
    // [END stopConditions]

    // [START thumbnailGeneration]
    // Download file from bucket.
    const bucket = admin.storage().bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const metadata = {
      contentType: contentType,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4()
      }
    };
    await bucket.file(filePath).download({ destination: tempFilePath });
    functions.logger.log('Image downloaded locally to', tempFilePath);
    // Get Dimensions of the image
    const { stdout } = await execFile(
      'identify',
      ['-format', '%wx%h', tempFilePath],
      {
        capture: ['stdout', 'stderr']
      } as any
    );
    const [width, height] = (stdout as any).split('x');

    const minSide = 200;
    const ratio = Math.max(minSide / height, minSide / width);

    const size = `${Math.round(width * ratio)}x${Math.round(height * ratio)}`;
    functions.logger.log(
      `Image width: ${width}, height: ${height}, thumbSize: ${size}`
    );

    // Generate a thumbnail using ImageMagick.
    await spawn('convert', [
      tempFilePath,
      '-thumbnail',
      `${size}>`,
      tempFilePath
    ]);
    functions.logger.log('Thumbnail created at', tempFilePath);
    // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
    const thumbFileName = `${thumbPath}/thumb@${size}-${fileName}`;
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
    // Uploading the thumbnail.
    const [file] =
      (await bucket.upload(tempFilePath, {
        destination: thumbFilePath,
        metadata: metadata
      })) || [];

    if (!file || file.exists()) {
      // Clear thumbnail in database
      const service = Container.get<ArtworkService>(TYPES.ArtworkService);
      const [artwork] = (await service.findBy('imgUrl', filePath)) || [];
      if (artwork) {
        const { id } = artwork;
        const thumbnails: IThumbnail = {
          url: thumbFilePath,
          width,
          height
        };
        const result = await service.update(id, { thumbnails });
        if (result) {
          functions.logger.log(`==== Updated thumbnail for artwork ${id} ====`);
          return fs.unlinkSync(tempFilePath);
        }
      }
    }

    functions.logger.log(
      `==== Couldn't update thumbnails for artwork with origin image ${filePath} ====`
    );

    // Once the thumbnail has been uploaded delete the local file to free up disk space.
    return fs.unlinkSync(tempFilePath);
    // [END thumbnailGeneration]
  });

export { generateThumbnail };
