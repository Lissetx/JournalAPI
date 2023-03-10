module.exports = function () {
  const db = require("../../../db.js");

  const {
    deleteEntry,
    patchUpdateEntry,
  } = require("../../../streams/kafka.js");
  let operations = {
    GET,
    PATCH,
    DELETE
  };

  async function GET(req, res, next) {
    console.log("GET /entries/:entryId");
    try {
      const database = await db.connectDatabase();
      const entry = await database
        .collection("Entries")
        .findOne({ entryId: parseInt(req.params.entryId) });
      //set link to the journal id of the entry
      entry.journalId = `http://localhost:5050/journals/${entry.journalId}`;
      //return entry
      res.status(200).json(entry);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  ///////////// use producer to send to kafka

  async function PATCH(req, res, next) {
    console.log("PATCH /entries/:entryId");
    console.log("req.params:", req.params);
    console.log("req.body:", req.body);
    try {
      //No database update, just send to kafka
      //add the entryId to the body
      req.body.entryId = parseInt(req.params.entryId);
      await patchUpdateEntry("entryUpdated", req.body);
      res.status(200).json({ message: "Entry updated" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async function DELETE(req, res, next) {
    console.log("DELETE /entries/:entryId");
    console.log("req.params:", req.params);
    try {
      //No database update, just send to kafka
      //send as json
      const entryIdJson = { entryId: parseInt(req.params.entryId) };
      await deleteEntry("entryDeleted", entryIdJson);
      res.status(200).json({ message: "Entry deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  GET.apiDoc = {
    summary: "Get an entry by id",
    description: "Get an entry by id",
    operationId: "getEntryById",
    parameters: [
      {
        in: "path",
        name: "entryId",
        schema: {
          type: "integer",
          format: "int64",
        },
        required: true,
        description: "The id of the entry to get",
      },
    ],
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/entry",
            },
          },
        },
      },
    },
  };

  PATCH.apiDoc = {
    summary: "Update an entry by id",
    description: "Update an entry by id",
    operationId: "updateEntryById",
    parameters: [
      {
        in: "path",
        name: "entryId",
        schema: {
          type: "integer",
          format: "int64",
        },
        required: true,
        description: "The id of the entry to update",
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/entry",
          },
        },
      },
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: {
              type: "object",

              properties: {
                message: {
                  type: "string",
                  example: "Entry created",
                },
              },
            },
          },
        },
      },
    },
  };

  DELETE.apiDoc = {
    summary: "Delete an entry by id",
    description: "Delete an entry by id",
    operationId: "deleteEntryById",
    parameters: [
      {
        in: "path",
        name: "entryId",
        schema: {
          type: "integer",
          format: "int64",
        },
        required: true,
        description: "The id of the entry to delete",
      },
    ],
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: {
              type: "object",

              properties: {
                message: {
                  type: "string",
                  example: "Entry created",
                },
              },
            },
          },
        },
      },
    },
  };

  return operations;
};
