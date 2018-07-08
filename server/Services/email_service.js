import path from 'path';
import mailer from '@sendgrid/mail';
import ejs from 'ejs';

require('dotenv').config();

mailer.setApiKey(process.env.SENDGRID_API_KEY);
const env = process.env.NODE_ENV || 'development';

const config = require(`${__dirname}/../config/config.json`)[env];

export default class EmailService {
    constructor() {
        this.message = {};
        this.template = '';
    }

    sendEmail(messageObject) {
        this.message = messageObject;
        mailer.send(this.message).then(() => {
            console.log('Email Sent!');
        }).catch((error) => {
            console.log(error);
        });
    }

    signupEmail(messageData) {
        const {
            email,
            firstname,
            lastname,
            username,
            verifiedHash,
        } = messageData;
        const url = `"${config.api_url}/users/verify/${verifiedHash}"`;

        ejs.renderFile(`${path.join(__dirname, '../Templates/Signup.ejs')}`, {
            email,
            firstname,
            lastname,
            username,
            url,
        }, (err, data) => {
            if (data) {
                const emailData = {
                    from: 'Admin@reminder.io',
                    to: email,
                    subject: 'Welcome To Reminder.io !',
                    html: data,
                };
                this.sendEmail(emailData);
            } else {
                console.log(err); // logging service here?
            }
        });

        // create template
    }
}
