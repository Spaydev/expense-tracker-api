const createSchema = {
  body: {
    type: "object",
    additionalProperties: true,
    required: ["title", "amount", "date" , "categoryId"],
    properties: {
      title: {
        type: "string",
      },
      amount: {
        type: "number",
      },
      date: {
        type: "string",
        format: "date-time",
      },
      notes: {
        type: "string",
        maxLength: 500,
      },
      categoryId: {
        type: "string"
      },
    },
  },
};

module.exports = {
  createSchema,
};
