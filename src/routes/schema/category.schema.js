const createSchema = {
  body: {
    type: "object",
    additionalProperties: true,
    required: ["name"],
    properties: {
      name: {
        type: "string",
        minLength: 1
      },
    },
  },
};


module.exports = {
  createSchema,
};
