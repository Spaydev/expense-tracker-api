const registerSchema = {
  body: {
    type: "object",
    additionalProperties: false,
    required: ["email", "password", "nickName"],
    properties: {
      email: {
        type: "string",
        format: "email",
        maxLength: 255,
      },
      password: {
        minLength: 6,
        maxLength: 128,
        type: "string",
      },
      nickName: {
        type: "string",
        minLength: 2,
        maxLength: 50,
      },
    },
  },
};
const loginSchema = {
  body: {
    type: "object",
    additionalProperties: false,
    required: ["email", "password"],
    properties: {
      email: {
        type: "string",
        format: "email",
        maxLength: 255,
      },
      password: {
        minLength: 6,
        maxLength: 128,
        type: "string",
      },
    },
  },
};
module.exports = {
  registerSchema,
  loginSchema,
};
