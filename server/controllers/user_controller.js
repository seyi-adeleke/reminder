import jwt from 'jsonwebtoken';

import models from '../models';
import utitlity from '../utils/Utilities';
import httpUtilities from '../utils/httpUtilites';

const env = process.env.NODE_ENV || 'development';

// eslint-disable-next-line
const config = require(`${__dirname}/../config/config.json`)[env];
const { User, Reminder } = models;

export default {
    signUp: (request, response) => {
        const {
            email,
            firstname,
            lastname,
            username,
            password,
        } = request.body;
        User.findOne({
            where: {
                email,
                username,
            },
        }).then((user) => {
            if (user) {
                return httpUtilities.constructInvalidRequest(422, 'username and email must be unique', response);
            }
            const payload = utitlity.trim({
                email,
                firstname,
                lastname,
                username,
                password,
            });
            User.create(payload).then((newUser) => {
                const data = {
                    email: newUser.email,
                    firstname: newUser.firstname,
                    lastname: newUser.lastname,
                    username: newUser.username,
                };
                return httpUtilities.constructOkResponse(201, 'User Created successfully', data, null, response);
            }).catch(error => response.status(400).send({
                message: `message: ${error.name}`,
                data: error,
                code: 400,
            }));
            return null;
        }).catch(error => httpUtilities.constructBadResponse(error.code, error.message, response));
    },

    signIn: (request, response) => {
        const {
            username,
            password,
        } = request.body;

        User.findOne({
            where: {
                username,
            },
            attributes: ['firstname', 'lastname', 'email', 'username', 'role', 'password', 'id'],
        }).then((user) => {
            if (!user) {
                return response.status(404).send({
                    message: 'This user does not exist',
                    code: 404,
                });
            }
            utitlity.comparePassword(password, user.password).then((result) => {
                if (result) {
                    const token = jwt.sign({ user }, config.jwt_secret, { expiresIn: '24h' });
                    return httpUtilities.constructOkResponse(200, 'Login succesfull', user, { token }, response);
                }
                return httpUtilities.constructInvalidRequest(401, 'Invalid username/password', response);
            });
            return null;
        }).catch(error => response.status(400).send({
            message: `message: ${error.name}`,
            data: error,
            code: 400,
        }));
    },

    getUsers: (request, response) => {
        User.findAll({
            include: [{
                model: Reminder,
                as: 'Reminders',
            }],
            attributes: { exclude: ['password'] },
        }).then(users => httpUtilities.constructOkResponse(200, 'Users found', users, null, response))
            .catch(error => response.status(400).send({
                message: `message: ${error.name}`,
                data: error,
                code: 400,
            }));
    },

    getUser: (request, response) => {
        User.findOne({
            where: {
                id: request.params.id,
            },
            attributes: { exclude: ['password'] },
        }).then((user) => {
            if (user) {
                return httpUtilities.constructOkResponse(200, 'User Found', user, null, response);
            }
            return httpUtilities.constructOkResponse(200, 'This user does not exist', [], null, response);
        }).catch(error => httpUtilities.constructBadResponse(error.code, 'There was an error processing this request', error.message, response));
    },

    getReminders: (request, response) => {
        User.findOne({
            where: {
                id: request.params.id,
            },
        }).then((user) => {
            if (user) {
                return user.getReminders().then((reminders) => {
                    if (!reminders.length) {
                        return httpUtilities.constructOkResponse(205, 'This user does not have any reminders', [], null, response);
                    }
                    return httpUtilities.constructOkResponse(200, 'Reminders Found', reminders, null, response);
                });
            }
            return httpUtilities.constructOkResponse(200, 'This user does not exist', [], null, response);
        }).catch(error => httpUtilities.constructBadResponse(error.code, 'There was an error processing this request', error.message, response));
    },


};
