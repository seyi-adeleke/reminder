export default {
  constructOkResponse: (code, message, payload, meta, response) => response.status(code).send({
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
};
