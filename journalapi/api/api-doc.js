const apiDoc = {
  openapi: "3.0.1",
  info: {
    title: "Journal API",
    description:
      "This API allows you to create, read, update, and delete journal entries.",
    version: "1.0.0",
  },
  paths: {},
  components: {
    parameters: {
      journalId: {
        name: "journalId",
        in: "path",
        required: true,
        schema: { $ref: "#/components/schemas/journalId" },
      },
      userId: {
        name: "userId",
        in: "path",
        required: true,
        schema: { $ref: "#/components/schemas/userId" },
      },
      entryId: {
        name: "entryId",
        in: "path",
        required: true,
        schema: { $ref: "#/components/schemas/entryId" },
      },
    },
    schemas: {
      journalId: {
        type: "string",
      },
      journal: {
        type: "object",
        properties: {
          id: { $ref: "#/components/schemas/journalId" },
          userId: { $ref: "#/components/schemas/userId" },
          title: { type: "string" },
          description: { type: "string" },
          entries: {
            type: "array",
            items: { $ref: "#/components/schemas/entry" },
          },
        },
      },
      entryId: {
        type: "string",
      },
      entry: {
        type: "object",
        properties: {
          id: { $ref: "#/components/schemas/entryId" },
          journalId: { $ref: "#/components/schemas/journalId" },
          title: { type: "string" },
          content: { type: "string" },
          date: { type: "string" },
        },
      },
      userId: {
        type: "string",
      },
      user: {
        type: "object",
        properties: {
          id: { $ref: "#/components/schemas/userId" },
          username: { type: "string" },
          password: { type: "string" },
          journals: {
            type: "array",
            items: { $ref: "#/components/schemas/journal" },
          },
        },
      },
    },
  },
};
//     components: {
//         securitySchemes: {
//             bearerAuth: {
//                 type: "http",
//                 scheme: "bearer",
//                 bearerFormat: "JWT",
//             },
//         },
//     },
//     security: [
//         {
//             bearerAuth: [],
//         },
//     ],
// };

module.exports = apiDoc;
