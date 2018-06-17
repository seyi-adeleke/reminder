import controllers from '../controllers';
import {
    isAdmin,
    isAuthenticated,
    validateParams,
    validateSignUpRequest,
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
        .get(isAuthenticated, validateParams, userController.getUser);
};

export default routes;
