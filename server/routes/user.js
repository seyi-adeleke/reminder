import controllers from '../controllers';
import { isAdmin, isAuthenticated, validateParams } from '../middleware';

const {
    userController,
} = controllers;


const routes = (router) => {
    router.route('/user')
        .get(isAuthenticated, isAdmin, userController.getUsers)
        .post(userController.signUp);

    router.route('/user/signin')
        .post(userController.signIn);

    router.route('/user/:id')
        .get(isAuthenticated, validateParams, userController.getUser);
};

export default routes;
