export default {
    constructOkResponse: (code, message, payload, meta, response) => {
        return response.status(code).send({
            code,
            message,
            data: {
                payload,
            },
            ...meta,
        })
    },

    constructInvalidRequest: (code, message, response) => {
        return response.status(code).send({
            code,
            message
        })
    }
}
