import controllers from '../controllers';
import {
    isAdmin,
    isAuthenticated,
    validateCreateReminderRequest,
    validateParams,
    validateAccess,
} from '../middleware';

const {
    reminderController,
} = controllers;

const routes = (router) => {
    router.route('/reminders')
        .get(isAuthenticated, isAdmin, reminderController.getReminders)
        .post(isAuthenticated, validateCreateReminderRequest, reminderController.createReminder);

    router.route('/reminders/:id')
        .get(isAuthenticated, validateParams, reminderController.getReminder)
        .delete(isAuthenticated, validateAccess, validateParams, reminderController.deleteReminder);
};

export default routes;
