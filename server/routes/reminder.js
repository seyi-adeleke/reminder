import controllers from '../controllers';
import {
    isAdmin,
    isAuthenticated,
    validateCreateReminderRequest,
    validateParams,
    validateUpdateReminderRequest,
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
        .delete(isAuthenticated, validateParams, reminderController.deleteReminder)
        .put(
            isAuthenticated,
            validateParams,
            validateUpdateReminderRequest,
            reminderController.updateReminder,
        );
};

export default routes;
