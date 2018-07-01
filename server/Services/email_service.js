import mailer from '@sendgrid/mail';

require('dotenv').config();

mailer.setApiKey(process.env.SENDGRID_API_KEY);

export default {
    sendEmail: (message) => {
        mailer.send(message).then(() => {
            console.log('Email Sent!');
        }).catch((error) => {
            console.log(error);
        });
    },
};
