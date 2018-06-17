import bcrypt from 'bcrypt';
import moment from 'moment';

export default {
    comparePassword: async (plainTextPassword, hash) => {
        const match = await bcrypt.compare(plainTextPassword, hash);
        return match;
    },

    isValidEmail: (email) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(email);
    },

    checkStringsValidity: (...args) => {
        const invalidStrings = args.filter(arg => typeof arg === 'undefined' || !arg || typeof arg === 'number');
        if (invalidStrings.length) {
            return false;
        }
        return true;
    },

    trim: stringsObject => Object.keys(stringsObject).reduce((acc, key) => {
        acc[key.trim()] = stringsObject[key].trim();
        return acc;
    }, {}),

    checkDateValidity: date => moment(date, 'MM-DD-YYYY').isValid(),

};
