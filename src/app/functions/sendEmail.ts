import { SendGrid } from '@/src/infra/mail';
import { region, runtimeOptions } from './configs/runtime';
import * as functions from 'firebase-functions';
import Container from '@/src/container';
import TYPES from '@/src/types';
import { EmailContent } from '@/src/infra/mail/types';
import { ErrorCode, HttpsError } from '@/app/errors';
const pick = require('ramda.pick');

const sendEmail = functions
  .runWith(runtimeOptions)
  .region(region)
  .https.onCall(async (data, context) => {
    try {
      const mailData: EmailContent = pick(
        ['sender', 'recipient', 'templateId', 'templateData'],
        data
      );

      const sendGrid = Container.get<SendGrid>(TYPES.SendGrid);
      await sendGrid.send(mailData);

      return {
        status: 200,
        message: 'Mail sent successfully!'
      };
    } catch (err) {
      functions.logger.error(err);
      const { code = ErrorCode.INTERNAL } = err;
      throw new HttpsError(code, err);
    }
  });

export { sendEmail };
