module.exports = function(){
    const db = require('../../../db.js') 

    let operations = {
        GET
    }

    async function GET(req, res, next){
        console.log("GET /entries");
        const database = await db.connectDatabase();
        const entries = await database.collection('Entries').find({}).toArray();
        

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            //replace journal with link to journal
            entry.journalId =  `http://localhost:5050/journals/${entry.journalId}`;
        }
        //return users
        res.status(200).json(entries);
    }

    GET.apiDoc = {
        summary: 'Get all entries',
        description: "Get a list of all entries",
        operationId: 'getEntries',
        responses : {
            200: {
                description: 'OK',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/entry' }
                        },
                    },
                },
            },
        },
    };

    return operations;
}