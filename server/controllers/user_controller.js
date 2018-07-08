import jwt from 'jsonwebtoken';

import models from '../models';
import utitlity from '../utils/Utilities';
import httpUtilities from '../utils/httpUtilites';
import services from '../Services';

const env = process.env.NODE_ENV || 'development';

// eslint-disable-next-line
const config = require(`${__dirname}/../config/config.json`)[env];
const { User, Reminder } = models;

const { EmailService } = services;

const emailHelper = new EmailService();


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
                $or: [{ email }, { username }],
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
                    verifiedHash: newUser.verified_hash,
                };
                emailHelper.signupEmail(data);
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
                deleted: false,
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
                    const token = jwt.sign({ id: user.id, role: user.role }, config.jwt_secret, { expiresIn: '24h' });
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
            where: {
                deleted: false,
            },
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
                deleted: false,
            },
            attributes: { exclude: ['password'] },
        }).then((user) => {
            if (user) {
                return httpUtilities.constructOkResponse(200, 'User Found', user, null, response);
            }
            return httpUtilities.constructOkResponse(200, 'This user does not exist', [], null, response);
        }).catch(error => httpUtilities.constructBadResponse(error.code, 'There was an error processing this request', error.message, response));
    },

    getUserReminders: (request, response) => {
        User.findOne({
            where: {
                id: request.params.id,
            },
        }).then((user) => {
            if (user) {
                return user.getReminders({
                    where: {
                        deleted: false,
                    },
                }).then((reminders) => {
                    if (!reminders.length) {
                        return httpUtilities.constructOkResponse(205, 'This user does not have any reminders', [], null, response);
                    }
                    return httpUtilities.constructOkResponse(200, 'Reminders Found', reminders, null, response);
                });
            }
            return httpUtilities.constructOkResponse(200, 'This user does not exist', [], null, response);
        }).catch(error => httpUtilities.constructBadResponse(error.code, 'There was an error processing this request', error.message, response));
    },

    deleteUser: (request, response) => {
        User.findOne({
            where: {
                id: request.params.id,
            },
        }).then((user) => {
            if (user === null) {
                return httpUtilities.constructInvalidRequest(404, 'This User does not exist', response);
            }
            if (user.role === 1) {
                return httpUtilities.constructInvalidRequest(409, 'You cannot delete this resource', response);
            }
            if (user.deleted) {
                return httpUtilities.constructInvalidRequest(409, 'This resource has been deleted already', response);
            }
            user.update({
                deleted: true,
                updateAt: Date.now(),
            }).then(() => {
                user.getReminders({
                    where: {
                        deleted: false,
                    },
                }).then((reminders) => {
                    const reminderIds = reminders.map(reminder => reminder.id);
                    Reminder.update({
                        updatedAt: Date.now(),
                        deleted: true,
                    }, {
                        where: {
                            id: {
                                $in: reminderIds,
                            },
                        },
                    }).then(() => httpUtilities.constructOkResponse(200, 'Resource succesfully deleted', [], null, response));
                });
            });
            return null;
        }).catch(error => httpUtilities.constructBadResponse(501, 'There was an error processing this request', error.message, response));
    },

    verifyUser: (request, response) => {
        User.findOne({
            where: {
                id: request.decoded.id,
                verified_hash: request.params.hash,
            },
        }).then((user) => {
            if (user) {
                user.update({
                    verified: true,
                    verified_hash: null,
                });
                return httpUtilities.constructOkResponse(200, 'User Verified!', [], null, response);
            }
            return httpUtilities.constructOkResponse(200, 'This user does not exist', [], null, response);
        }).catch(error => httpUtilities.constructBadResponse(error.code, 'There was an error processing this request', error.message, response));
    },

};
