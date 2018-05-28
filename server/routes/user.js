import controllers from '../controllers';

const {
  userController,
} = controllers;



const routes = (router) => {
  router.route('/user')
    .post(userController.signUp);
}

export default routes;