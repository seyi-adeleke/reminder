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
        const { id } = request.decoded;
        Reminder.create({
            message: message.trim(),
            user: id,
            triggerDate,
        }).then(reminder => httpUtilities.constructOkResponse(200, 'Reminder created', reminder, null, response))
            .catch(error => httpUtilities.constructBadResponse(501, 'There was an error processing this request', error.message, response));
    },

    getReminder: (request, response) => {
        Reminder.findOne({
            where: {
                $or: [{ id: request.params.id }, { deleted: false }],
            },
        }).then((reminder) => {
            if (reminder && reminder.user === request.decoded.id) {
                return httpUtilities.constructOkResponse(200, 'Reminder Found', reminder, null, response);
            }
            return httpUtilities.constructOkResponse(200, 'This reminder does not exist', [], null, response);
        }).catch(error => httpUtilities.constructBadResponse(error.code, 'There was an error processing this request', error.message, response));
    },

    deleteReminder: (request, response) => {
        Reminder.findOne({
            where: {
                id: request.params.id,
            },
        }).then((reminder) => {
            if (reminder.deleted) {
                return httpUtilities.constructInvalidRequest(409, 'This resource has been deleted already', response);
            } else if (reminder.user !== request.decoded.id) {
                return httpUtilities.constructInvalidRequest(403, 'You do not have access to this resource', response);
            }
            reminder.update({
                deleted: true,
                updatedAt: Date.now(),
            }).then(() => httpUtilities.constructOkResponse(200, 'Resource successfully deleted', [], null, response));
            return null;
        }).catch(error => httpUtilities.constructBadResponse(error.code, 'There was an error processing this request', error.message, response));
    },

    updateReminder: (request, response) => {
        Reminder.findOne({
            where: {
                $or: [{ id: request.params.id }, { deleted: false }],
            },
        }).then((reminder) => {
            if (!reminder) {
                return httpUtilities.constructOkResponse(200, 'This resource does not exist', [], null, response);
            }
            if (reminder.user !== request.decoded.id) {
                return httpUtilities.constructInvalidRequest(403, 'You do not have access to this resource', response);
            }
            reminder.update({
                updatedAt: Date.now(),
                triggerDate: request.body.triggerDate
                    ? request.body.triggerDate
                    : reminder.triggerDate,
                message: request.body.message ? request.body.message : reminder.message,
            }).then(() => httpUtilities.constructOkResponse(200, 'Resource successfully updated', [], null, response));
            return null;
        }).catch(error => httpUtilities.constructBadResponse(error.code, 'There was an error processing this request', error.message, response));
    },
};
