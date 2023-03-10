module.exports = function () {
  const db = require("../../../db.js");
  const { postCreateEntry } = require("../../../streams/kafka.js");

  let operations = {
    GET,
    POST,
  };

  async function GET(req, res, next) {
    console.log("GET /entries");
    const database = await db.connectDatabase();
    const entries = await database.collection("Entries").find({}).toArray();

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      //replace journal with link to journal
      entry.journalId = `http://localhost:5053/journals/${entry.journalId}`;
    }
    //return users
    res.status(200).json(entries);
  }

  /////////////////////////// use producer to send to kafka

  async function POST(req, res, next) {
    console.log("POST /entries");
    console.log("req.body:", req.body);
    console.log("WE ARE HERE");
    //send to kafka
   
    try {
      await postCreateEntry("entryCreated", req.body);
      res.status(201).json({ message: "Entry created" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  GET.apiDoc = {
    summary: "Get all entries",
    description: "Get a list of all entries",
    operationId: "getEntries",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: { $ref: "#/components/schemas/entry" },
            },
          },
        },
      },
    },
  };

  POST.apiDoc = {
    summary: "Create a new entry",
    description: "Create a new entry",
    operationId: "createEntry",
    requestBody: {
      description: "Entry to create",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/entry" },
        },
      },
      required: true,
    },
    responses: {
      201: {
        description: "Created",
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
