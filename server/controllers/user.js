import jwt from 'jsonwebtoken';

import models from '../models';
import utitlity from '../utils/Utilities';
import httpHelpers from '../utils/httpUtilites';

const env = process.env.NODE_ENV || 'development';

// eslint-disable-next-line
const config = require(`${__dirname}/../config/config.json`)[env];

const { User } = models;

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
        return response.status(422).send({
          message: 'username and email must be unique',
          code: 422,
        });
      }
      User.create({
        email,
        firstname,
        lastname,
        username,
        password,
        role: 1,
      }).then(newUser => response.status(201).send({
        message: 'User Created successfully',
        data: {
          email: newUser.email,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          username: newUser.username,
        },
        code: 201,
      })).catch(error => response.status(400).send({
        message: `message: ${error.name}`,
        data: error,
        code: 400,
      }));
    });
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
      attributes: ['firstname', 'lastname', 'email', 'username', 'role', 'password'],
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
          return httpHelpers.constructOkResponse(200, 'Login succesfull', user, { token }, response);
        }
        return httpHelpers.constructInvalidRequest(401, 'Invalid username/password', response);
      });
      return null;
    }).catch(error => response.status(400).send({
      message: `message: ${error.name}`,
      data: error,
      code: 400,
    }));
  },
};
