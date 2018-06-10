export default {
    constructOkResponse: (code, message, payload = [], meta = null, response) =>
        response.status(code).send({
            code,
            message,
            data: {
                payload,
            },
            ...meta,
        }),

    constructInvalidRequest: (code, message, response) => response.status(code).send({
        code,
        message,
    }),

    constructBadResponse: (code, message, error, response) => response.status(code).send({
        code,
        error,
        message,
    }),
};
