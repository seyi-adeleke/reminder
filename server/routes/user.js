import controllers from '../controllers';

const {
  userController,
} = controllers;



const routes = (router) => {
  router.route('/user')
    .post(userController.createUser);
}

export default routes;