import { inject } from 'inversify';
import TYPES from '@/src/types';
import { provide } from 'inversify-binding-decorators';
import { IArtworkEntity, ICyoStatus } from '@/domain/types';
import { ISeeding } from './interfaces/seeding';
import { Artwork } from '@/domain';
import { ArtworkService } from '@/src/app/services';
import { BaseSeeding } from '.';

@provide(TYPES.ArtworkSeeding)
export class ArtworkSeeding extends BaseSeeding implements ISeeding {
  @inject(TYPES.ArtworkService)
  private readonly ArtworkService: ArtworkService;

  getArtworkData(): IArtworkEntity[] {
    return [
      {
        imgUrl: 'images/183547573_110853177737195_851846609218497648_n.jpg',
        thumbnails: {
          url: 'images/183547573_110853177737195_851846609218497648_n.jpg',
          width: 100,
          height: 100
        },
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        contact: {
          email: 'thagdet96@gmail.com',
          name: 'Dat',
          age: 25,
          country: 'Viet Nam'
        },
        status: ICyoStatus.IN_REVIEW
      },
      {
        imgUrl: 'images/183628537_164784448892606_5429103896350473610_n.jpg',
        thumbnails: {
          url: 'images/183628537_164784448892606_5429103896350473610_n.jpg',
          width: 100,
          height: 100
        },
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        contact: {
          email: 'halay08@gmail.com',
          name: 'Mr.Khiem',
          age: 33,
          country: 'Viet Nam'
        },
        status: ICyoStatus.APPROVED
      },
      {
        thumbnails: {
          width: 100,
          height: 100,
          url: 'images/eb04e019-08f0-4ac9-ad1b-1c3f590e5ca4.png'
        },
        imgUrl: 'images/eb04e019-08f0-4ac9-ad1b-1c3f590e5ca4.png',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        contact: {
          name: 'Thinh Dinh',
          age: 26,
          country: 'Viet Nam'
        },
        status: ICyoStatus.APPROVED
      },
      {
        thumbnails: {
          width: 100,
          height: 100,
          url: 'images/185245878_377343746919085_1237031618668715602_n.jpg'
        },
        imgUrl: 'images/185245878_377343746919085_1237031618668715602_n.jpg',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        contact: {
          name: 'Thagdet',
          email: 'thagdet96@gmail.com',
          age: 25,
          country: 'Viet Nam'
        },
        status: ICyoStatus.IN_REVIEW
      },
      {
        thumbnails: {
          width: 100,
          height: 100,
          url: 'images/166941807_263701668728056_6396550715513299493_n.png'
        },
        imgUrl: 'images/166941807_263701668728056_6396550715513299493_n.png',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        contact: {},
        status: ICyoStatus.REJECTED
      },
      {
        thumbnails: {
          width: 100,
          height: 100,
          url: 'images/eb04e019-08f0-4ac9-ad1b-1c3f590e5ca4.png'
        },
        imgUrl: 'images/eb04e019-08f0-4ac9-ad1b-1c3f590e5ca4.png',
        message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        contact: {
          name: 'Ken Lee',
          email: 'halay08@gmail.com',
          country: 'Viet Nam'
        },
        status: ICyoStatus.IN_REVIEW
      }
    ];
  }

  async run() {
    const artworks = this.getArtworkData();

    for (const artwork of artworks) {
      const { imgUrl = '' } = artwork;

      // Check exist Artwork in Firestore
      const existedArtwork = await this.ArtworkService.findBy('imgUrl', imgUrl);
      if (existedArtwork.length > 0) {
        console.log(`Artwork ${imgUrl} already existed in the database`);
        continue;
      }

      // Create Firestore Artwork
      const entity: Artwork = Artwork.create(artwork);
      const newArtwork = await this.ArtworkService.create(entity);
      const newEntity = newArtwork.serialize();
      console.log(`New Artwork was created ${newEntity.id}`);
    }

    console.log('DONE!');
  }
}
