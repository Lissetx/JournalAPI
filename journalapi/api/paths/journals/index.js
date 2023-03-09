const apiDoc = require('../../api-doc.js');

module.exports = function(){
    const db = require('../../../db.js') 

    let operations = {
        GET
    }

    async function GET(req, res, next){
        console.log("GET /journals");
        const database = await db.connectDatabase();
        const journals = await database.collection('Journals').find({}).toArray();
        // set link to the user id of the journal
       

        for (let i = 0; i < journals.length; i++) {
            const journal = journals[i];
            //replace user with link to user
            journal.userId =  `http://localhost:5050/users/${journal.userId}`;
            //replace entries with links to entries
            for(let j = 0; j < journal.entries.length; j++){
                journal.entries[j] = {entry: `http://localhost:5050/entries/${journal.entries[j]}`};
            }
        }
        //loop trough the entries array and set a link to the entry id for each entry
        

        res.status(200).json(journals);
    }

    GET.apiDoc = {
        summary: 'Get all journals',
        description: "Get a list of all journals",
        operationId: 'getJournals',
        responses : {
            200: {
                description: 'OK',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/journal' }
                        },
                    },
                },
            },
        },
    };

    return operations;

}