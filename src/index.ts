require('dotenv').config();

// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata';
// eslint-disable-next-line import/no-unassigned-import
import 'module-alias/register';
// eslint-disable-next-line import/no-unassigned-import
import './ioc.loader';

import './firebase.config';

export * from '@/app/functions';
