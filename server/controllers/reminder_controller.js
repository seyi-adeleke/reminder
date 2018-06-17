import httpUtilities from '../utils/httpUtilites';
import models from '../models';

const { Reminder } = models;


export default {
    getReminders: (request, response) => {
        Reminder.findAll().then(reminders => httpUtilities.constructOkResponse(200, 'Reminders found', reminders, null, response))
            .catch(error => httpUtilities.constructBadResponse(error.code, 'There was an error processing this request', error.message, response));
    },

};
