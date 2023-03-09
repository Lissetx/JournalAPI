module.exports = function () {
  const db = require("../../../db.js");

  let operations = {
    GET,
  };

  async function GET(req, res, next) {
    console.log("GET /journals/:journalId");
    const database = db.connectDatabase();
    const journal = await database
      .collection("journals")
      .findOne({ id: parseInt(req.params.journalId) });
    //set link to the user id of the journal
    journal.links = { user: `/users/${journal.userId}` };
    //loop trough the entries array and set a link to the entry id for each entry
    journal.entries.forEach((entry) => {
      entry.links = { entry: `/entries/${entry.id}` };
    });
  }

  GET.apidoc = {
    summary: "Get a journal by id",
    description: "Get a journal by id",
    operationId: "getJournalById",
    parameters: [
        {
            in: 'path',
            name: 'journalId',
            schema: {
                type: 'integer',
                format: 'int64',
            },
            required: true,
            description: 'The id of the journal to get',
        },
    ],
    responses: {
        200: {
            description: 'OK',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/Journal',
                    },
                },
            },
        },
    },
};

return operations;

};