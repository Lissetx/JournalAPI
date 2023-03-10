module.exports = function () {
  const db = require("../../../db.js");
  const {
    deleteJournal,
    patchUpdateJounral,
  } = require("../../../streams/kafka.js");

  let operations = {
    GET,
    PATCH,
    DELETE,
  };

  async function GET(req, res, next) {
    console.log("GET /journals/:journalId");
    console.log("req.params:", req.params);
    try {
      const database = await db.connectDatabase();
      const journal = await database
        .collection("Journals")
        .findOne({ journalId: parseInt(req.params.journalId) });
      console.log("journal:", journal);
      //set link to the user id of the journal

      journal.userId = `http://localhost:5050/users/${journal.userId}`;
      // delete journal.userId;
      for (let i = 0; i < journal.entries.length; i++) {
        const entryId = journal.entries[i];
        journal.entries[i] = {
          entryId: `http://localhost:5050/entries/${entryId}`,
        };
      }
      res.status(200).json(journal);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /////////////// use producer to send to kafka
  async function PATCH(req, res, next) {
    console.log("PATCH /journals/:journalId");
    console.log("req.params:", req.params);
    console.log("req.body:", req.body);
    try {
      //No database update, just send to kafka
      //add the journalId to the body
      req.body.journalId = parseInt(req.params.journalId);
      await patchUpdateJounral("journalUpdated", req.body);
      res.status(200).json({ message: "Journal updated" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async function DELETE(req, res, next) {
    console.log("DELETE /journals/:journalId");
    console.log("req.params:", req.params);
    try {
      //No database update, just send to kafka
      //send as json
      const journalIdJson ={
        journalId: parseInt(req.params.journalId)
      }
      await deleteJournal("journalDeleted", journalIdJson);
      res.status(200).json({ message: "Journal deleted" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  GET.apidoc = {
    summary: "Get a journal by id",
    description: "Get a journal by id",
    operationId: "getJournalById",
    parameters: [
      {
        in: "path",
        name: "journalId",
        schema: {
          type: "integer",
          format: "int64",
        },
        required: true,
        description: "The id of the journal to get",
      },
    ],
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/journal",
            },
          },
        },
      },
    },
  };

  PATCH.apidoc = {
    summary: "Update a journal by id",
    description: "Update a journal by id",
    operationId: "updateJournalById",
    parameters: [
      {
        in: "path",
        name: "journalId",
        schema: {
          type: "integer",
          format: "int64",
        },
        required: true,
        description: "The id of the journal to update",
      },
    ],
    requestBody: {
      description: "Journal object that needs to be updated",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/journal",
          },
        },
      },
      required: true,
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

  DELETE.apidoc = {
    summary: "Delete a journal by id",
    description: "Delete a journal by id",
    operationId: "deleteJournalById",
    parameters: [
      {
        in: "path",
        name: "journalId",
        schema: {
          type: "integer",
          format: "int64",
        },
        required: true,
        description: "The id of the journal to delete",
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
              }
            },
          },
        },
      },
    },
  };

  return operations;
};
