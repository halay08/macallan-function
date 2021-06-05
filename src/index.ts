require('dotenv').config();

import container from './container';

import './firebase.config';
import { FirestoreData } from './infra/database/firestore';
import { Logger } from './infra/logging/pino';
import TYPES from './types';
import FireAuth from './infra/auth/firebase/auth';
import { buildProviderModule } from 'inversify-binding-decorators';

// Manually
container.bind(TYPES.Database).to(FirestoreData).inSingletonScope();

container.bind(TYPES.FireAuth).to(FireAuth).inSingletonScope();

container.bind(TYPES.Logger).to(Logger).inSingletonScope();

// Reflects all decorators provided by this package and packages them into
// a module to be loaded by the container
container.load(buildProviderModule());

export * from '@/app/functions';
