import * as sgMail from '@sendgrid/mail';
import { injectable } from 'inversify';
import { EmailContent } from './types';
import * as functions from 'firebase-functions';

@injectable()
export class SendGrid {
  async send(emailContent: EmailContent) {
    const { sendGridAPIKey } = functions.config().env;
    sgMail.setApiKey(sendGridAPIKey);

    const msg = {
      to: emailContent.recipient || '',
      from: emailContent.sender || '',
      templateId: emailContent.templateId || '',
      dynamicTemplateData: emailContent.templateData || {}
    };

    return await sgMail.send(msg);
  }
}
