// eslint-disable-next-line import/no-unassigned-import
// import './connection';

import { injectable } from 'inversify';
import FirestoreCollection from './collection';
import { User, Artwork, Content } from '@/domain';
import * as types from './types';
import { COLLECTIONS } from '../config/collection';

@injectable()
class FirestoreData {
  public static users: FirestoreCollection<User> = new FirestoreCollection(
    COLLECTIONS.User
  );

  public static artwork: FirestoreCollection<Artwork> = new FirestoreCollection(
    COLLECTIONS.Artwork
  );

  public static content: FirestoreCollection<Content> = new FirestoreCollection(
    COLLECTIONS.Content
  );
}

export { FirestoreCollection, FirestoreData, types };
