module.exports = function() {
    const db = require('../../../db.js')

    let operations = {
        GET
    }

    async function GET(req, res, next){
        console.log("GET /entries/:entryId");
        try{
        const database = await db.connectDatabase();
        const entry = await database.collection('Entries').findOne({entryId: parseInt(req.params.entryId)});
        //set link to the journal id of the entry
        entry.journalId = `http://localhost:5050/journals/${entry.journalId}`;
        //return entry
        res.status(200).json(entry);
        }catch(error)
        {
            console.log(error);
            res.status(500).json({message: "Internal server error"});
        }
    }

    GET.apiDoc = {
        summary: 'Get an entry by id',
        description: "Get an entry by id",
        operationId: 'getEntryById',
        parameters: [
            {
                in: 'path',
                name: 'entryId',
                schema: {
                    type: 'integer',
                    format: 'int64',
                },
                required: true,
                description: 'The id of the entry to get',
            },
        ],
        responses : {
            200: {
                description: 'OK',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/entry',
                        },
                    },
                },
            },
        },
    };

    return operations;

}