import bcrypt from 'bcrypt';


export default {
    comparePassword: async (plainTextPassword, hash) => {
        const match = await bcrypt.compare(plainTextPassword, hash);
        return match;
    },
};
