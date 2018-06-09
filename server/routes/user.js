import controllers from '../controllers';

const {
  userController,
} = controllers;


const routes = (router) => {
  router.route('/user')
    .post(userController.signUp);

  router.route('/user/signin')
    .post(userController.signIn);
};

export default routes;
