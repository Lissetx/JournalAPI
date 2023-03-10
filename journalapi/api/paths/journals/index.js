const apiDoc = require("../../api-doc.js");

module.exports = function () {
  const db = require("../../../db.js");
  const { postCreateJournal } = require("../../../streams/kafka.js");

  let operations = {
    GET,
    POST,
  };

  async function GET(req, res, next) {
    console.log("GET /journals");
    const database = await db.connectDatabase();
    const journals = await database.collection("Journals").find({}).toArray();
    // set link to the user id of the journal

    for (let i = 0; i < journals.length; i++) {
      const journal = journals[i];
      //replace user with link to user
      journal.userId = `http://localhost:5053/users/${journal.userId}`;
      //replace entries with links to entries
      for (let j = 0; j < journal.entries.length; j++) {
        journal.entries[j] = {
          entry: `http://localhost:5053/entriesservice/${journal.entries[j]}`,
        };
      }
    }
    //loop trough the entries array and set a link to the entry id for each entry

    res.status(200).json(journals);
  }

  async function POST(req, res, next) {
    console.log("POST /journals");
    console.log("req.body:", req.body);
    //send to kafka
    try {
      await postCreateJournal("journalCreated",req.body);
      res.status(201).json({ message: "Journal created" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  GET.apiDoc = {
    summary: "Get all journals",
    description: "Get a list of all journals",
    operationId: "getJournals",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: { $ref: "#/components/schemas/journal" },
            },
          },
        },
      },
    },
  };

  POST.apiDoc = {
    summary: "Create a journal",
    description: "Create a journal",
    operationId: "createJournal",
    requestBody: {
      description: "Journal object that needs to be added to the database",
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
      201: {
        description: "Journal created",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Journal created",
                },
              },
            },
          },
        },
      },
      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Internal server error",
                }
              }
            }
          }
        }
      }
    },
  };

  return operations;
};
