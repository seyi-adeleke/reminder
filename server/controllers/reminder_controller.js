import httpUtilities from '../utils/httpUtilites';
import models from '../models';

const { Reminder } = models;


export default {
    getReminders: (request, response) => {
        Reminder.findAll().then(reminders => httpUtilities.constructOkResponse(200, 'Reminders found', reminders, null, response))
            .catch(error => httpUtilities.constructBadResponse(error.code, 'There was an error processing this request', error.message, response));
    },

    createReminder: (request, response) => {
        const { message, triggerDate } = request.body;
        const {
            user: {
                id,
            },
        } = request.decoded;
        Reminder.create({
            message: message.trim(),
            user: id,
            triggerDate,
        }).then(reminder => httpUtilities.constructOkResponse(200, 'Reminder created', reminder, null, response))
            .catch(error => httpUtilities.constructBadResponse(501, 'There was an error processing this request', error.message, response));
    },

};
