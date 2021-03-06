import controllers from '../controllers';
import {
    isAdmin,
    isAuthenticated,
    validateParams,
    validateSignUpRequest,
    validateAccess,
} from '../middleware';

const {
    userController,
} = controllers;


const routes = (router) => {
    router.route('/users')
        .get(isAuthenticated, isAdmin, userController.getUsers)
        .post(validateSignUpRequest, userController.signUp);

    router.route('/users/signin')
        .post(userController.signIn);

    router.route('/users/:id')
        .get(isAuthenticated, validateParams, userController.getUser)
        .delete(isAuthenticated, isAdmin, userController.deleteUser);

    router.route('/users/:id/reminders')
        .get(isAuthenticated, validateParams, validateAccess, userController.getUserReminders);

    router.route('/users/verify/:hash')
        .put(isAuthenticated, userController.verifyUser);
};

export default routes;
