import user from './user';
import reminder from './reminder';

export default (router) => {
    user(router);
    reminder(router);
};
