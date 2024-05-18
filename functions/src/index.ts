/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

/*
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, you need to enable "Allow less secure apps" in your Gmail account settings.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

exports.sendEmail = functions.https.onCall((data: any, context: any) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: data.to,
        subject: data.subject,
        text: data.message
    };

    return transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            return { success: false, error: error.toString() };
        }
        return { success: true, info: info.response };
    });
});*/

const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    '105336746814-rnihdn3qc8uioi4v0erk2esc6sk0mibj.apps.googleusercontent.com',
    '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',
    'https://developers.google.com/oauthplayground' // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: '1//0443P-q3KSQ6XCgYIARAAGAQSNwF-L9IrXX7jxP9-ypATE71HOGmm8XWe7HY3R2w63t4kv08140a5w9JfuQ1R00tpkLnNmOF3GdQ'
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'edittdewallapop@gmail.com',
        clientId: '105336746814-rnihdn3qc8uioi4v0erk2esc6sk0mibj.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//0443P-q3KSQ6XCgYIARAAGAQSNwF-L9IrXX7jxP9-ypATE71HOGmm8XWe7HY3R2w63t4kv08140a5w9JfuQ1R00tpkLnNmOF3GdQ',
        accessToken: oauth2Client.getAccessToken()
    }
});

