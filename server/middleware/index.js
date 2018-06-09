import jwt from 'jsonwebtoken';
import httpHelpers from '../utils/httpUtilites';

const env = process.env.NODE_ENV || 'development';

// eslint-disable-next-line
const config = require(`${__dirname}/../config/config.json`)[env];

const isAuthenticated = (req, res, next) => {
    if (!req.headers.authorization) {
        return httpHelpers.constructInvalidRequest(401, 'You are not logged in', res);
    }
    const token = req.headers.authorization;

    jwt.verify(token, config.jwt_secret, (error, decoded) => {
        if (error) {
            return httpHelpers.constructInvalidRequest(400, 'There was an error processing your request', res);
        }
        req.decoded = decoded;
        if (req.decoded.user.role === 1) {
            req.isAdmin = true;
        }
        return next();
    });
};


const isAdmin = (req, res, next) => {
    if (!req.isAdmin) {
        return httpHelpers.constructInvalidRequest(403, 'You do not have access to this resource', res);
    }
    return next();
};


export {
    isAdmin,
    isAuthenticated,
};
