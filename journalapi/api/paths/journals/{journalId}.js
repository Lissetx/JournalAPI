module.exports = function () {
  const db = require("../../../db.js");

  let operations = {
    GET
  };

  async function GET(req, res, next) {
    console.log("GET /journals/:journalId");
    console.log("req.params:", req.params);
    try{
    const database = await db.connectDatabase();
    const journal = await database.collection("Journals").findOne({ journalId: parseInt(req.params.journalId) });
      console.log("journal:", journal);
    //set link to the user id of the journal

     journal.userId = `http://localhost:5050/users/${journal.userId}`;
    // delete journal.userId;
    for (let i = 0; i < journal.entries.length; i++) {
        const entryId = journal.entries[i];
        journal.entries[i] = { entryId: `http://localhost:5050/entries/${entryId}` };
    }
      res.status(200).json(journal);
    }
 catch (error) {
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
                        $ref: '#/components/schemas/journal',
                    },
                },
            },
        },
    },
};

return operations;

};