// eslint-disable-next-line import/no-unassigned-import
import 'reflect-metadata';
// eslint-disable-next-line import/no-unassigned-import
import 'module-alias/register';
// eslint-disable-next-line import/no-unassigned-import
import './ioc.loader';

import { Container } from 'inversify';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';

const container = new Container();
if (
  process.env.NODE_ENV === 'development' &&
  process.env.ENABLE_LOGGER === 'true'
) {
  const logger = makeLoggerMiddleware();
  container.applyMiddleware(logger);
}

export default container;
