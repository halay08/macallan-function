import { inject } from 'inversify';
import TYPES from '@/src/types';
import { provide } from 'inversify-binding-decorators';
import { IContentEntity } from '@/domain/types';
import { ISeeding } from './interfaces/seeding';
import { Content } from '@/domain';
import { ContentService } from '@/src/app/services';
import { BaseSeeding } from '.';

@provide(TYPES.ContentSeeding)
export class ContentSeeding extends BaseSeeding implements ISeeding {
  @inject(TYPES.ContentService)
  private readonly ContentService: ContentService;

  getContentData(): IContentEntity[] {
    return [
      {
        title: 'Collaboration',
        excerpt:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porttitor eleifend ex at vulputate',
        content:
          ' Suspendisse tortor turpis, vehicula sed scelerisque a, convallis non urna. Maecenas scelerisque ante in augue porttitor, ac dictum est ultrices.',
        imgUrl: 'images/183628537_164784448892606_5429103896350473610_n.jpg',
        thumbnails: {
          url: 'images/183628537_164784448892606_5429103896350473610_n.jpg',
          width: 100,
          height: 100
        },
        videoUrl: 'https://www.youtube.com/watch?v=9o7tKXUjC6E'
      },
      {
        title: 'Place',
        excerpt:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porttitor eleifend ex at vulputate',
        content:
          ' Suspendisse tortor turpis, vehicula sed scelerisque a, convallis non urna. Maecenas scelerisque ante in augue porttitor, ac dictum est ultrices.',
        imgUrl: 'images/183547573_110853177737195_851846609218497648_n.jpg',
        thumbnails: {
          url: 'images/183547573_110853177737195_851846609218497648_n.jpg',
          width: 100,
          height: 100
        }
      }
    ];
  }

  async run() {
    const contents = this.getContentData();

    for (const content of contents) {
      const { title = '' } = content;

      // Check exist Content in Firestore
      const existedContent = await this.ContentService.findBy('title', title);
      if (existedContent.length > 0) {
        console.log(`Content ${title} already existed in the database`);
        continue;
      }

      // Create Firestore Content
      const entity: Content = Content.create(content);
      const newContent = await this.ContentService.create(entity);
      const newEntity = newContent.serialize();
      console.log(`New Content was created ${newEntity.id}`);
    }

    console.log('DONE!');
  }
}
