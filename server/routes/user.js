import controllers from '../controllers';
import { isAdmin, isAuthenticated } from '../middleware';

const {
    userController,
} = controllers;


const routes = (router) => {
    router.route('/user')
        .get(isAuthenticated, isAdmin, userController.getUsers)
        .post(userController.signUp);


    router.route('/user/signin')
        .post(userController.signIn);
};

export default routes;
