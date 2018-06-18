import jwt from 'jsonwebtoken';
import httpUtilites from '../utils/httpUtilites';
import utils from '../utils/Utilities';


const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line
const config = require(`${__dirname}/../config/config.json`)[env];

const isAuthenticated = (req, res, next) => {
    if (!req.headers.authorization) {
        return httpUtilites.constructInvalidRequest(401, 'You are not logged in', res);
    }
    const token = req.headers.authorization;
    jwt.verify(token, config.jwt_secret, (error, decoded) => {
        if (error) {
            return httpUtilites.constructInvalidRequest(400, 'There was an error processing your request', res);
        }
        req.decoded = decoded;
        if (req.decoded.role === 1) {
            req.isAdmin = true;
        }
        return next();
    });
};

const isAdmin = (req, res, next) => {
    if (!req.isAdmin) {
        return httpUtilites.constructInvalidRequest(403, 'You do not have access to this resource', res);
    }
    return next();
};

const validateParams = (req, res, next) => {
    const params = { ...req.params, id: parseInt(req.params.id, 10) };
    const paramKeys = Object.keys(params);
    const checkInvalidParams = paramKeys.filter((key) => {
        if (Number.isNaN(params[`${key}`])) {
            return key;
        }
    });
    if (checkInvalidParams.length) {
        return httpUtilites.constructInvalidRequest(400, 'Invalid Query Parameters', res);
    }
    return next();
};

const validateSignUpRequest = (req, res, next) => {
    const {
        email,
        firstname,
        lastname,
        username,
        password,
    } = req.body;
    if (!utils.isValidEmail(email) ||
        !utils.checkStringsValidity(firstname, lastname, username, password)) {
        return httpUtilites.constructInvalidRequest(400, 'Invalid request body', res);
    }
    return next();
};

const validateCreateReminderRequest = (req, res, next) => {
    const { message, triggerDate } = req.body;
    if (!utils.checkStringsValidity(message) || !utils.checkDateValidity(triggerDate)) {
        return httpUtilites.constructInvalidRequest(400, 'Invalid request body', res);
    }
    return next();
};

const validateAccess = (req, res, next) => {
    if (req.isAdmin) {
        return next();
    }
    const {
        id,
    } = req.decoded;

    if (id !== parseInt(req.params.id, 10)) {
        return httpUtilites.constructInvalidRequest(403, 'You do not have access to this resource', res);
    }
    return next();
};

export {
    isAdmin,
    isAuthenticated,
    validateParams,
    validateSignUpRequest,
    validateCreateReminderRequest,
    validateAccess,
};
