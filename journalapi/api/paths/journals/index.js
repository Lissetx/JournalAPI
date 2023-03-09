const apiDoc = require('../../api-doc.js');

module.exports = function(){
    const db = require('../../../db.js') 

    let operations = {
        GET
    }

    async function GET(req, res, next){
        console.log("GET /journals");
        const database = db.connectDatabase();
        const journals = await database.collection('journals').find().toArray();
        // set link to the user id of the journal
        journals.forEach(journal => {
            journal.links = {user: `/users/${journal.userId}`}
        });
        //loop trough the entries array and set a link to the entry id for each entry
        journals.forEach(journal => {
            journal.entries.forEach(entry => {
                entry.links = {entry: `/entries/${entry.id}`}
            })
        });

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
                            items: { $ref: '#/components/schemas/Journal' }
                        },
                    },
                },
            },
        },
    };

    return operations;

}