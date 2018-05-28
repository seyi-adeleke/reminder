import models from '../models';

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
              }
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
                email,
                role: 1
            }).then((newUser) => {
                return response.status(201).send({
                    message: 'User Created successfully',
                    data: {
                        email: newUser.email,
                        firstname: newUser.firstname,
                        lastname: newUser.lastname,
                        username: newUser.username
                    },
                    code: 201,
                  });
            })
        })
    }
}
