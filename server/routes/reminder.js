import controllers from '../controllers';
import {
    isAdmin,
    isAuthenticated,
    validateCreateReminderRequest,
} from '../middleware';

const {
    reminderController,
} = controllers;

const routes = (router) => {
    router.route('/reminders')
        .get(isAuthenticated, isAdmin, reminderController.getReminders)
        .post(isAuthenticated, validateCreateReminderRequest, reminderController.createReminder);
};

export default routes;
