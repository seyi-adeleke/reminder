import controllers from '../controllers';
import { isAdmin, isAuthenticated } from '../middleware';

const {
    reminderController,
} = controllers;

const routes = (router) => {
    router.route('/reminder')
        .get(isAuthenticated, isAdmin, reminderController.getReminders);
};

export default routes;
