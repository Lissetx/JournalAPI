module.exports = function(){
    const db = require('../../../db.js') 

    let operations = {
        GET
    }

    async function GET(req, res, next){
        console.log("GET /entries");
        const database = db.connectDatabase();
        const entries = await database.collection('entries').find().toArray();
        

        entries.forEach(entry => {
            //http://localhost:loadbalancerport/journals/:id
            entry.links = {journal: `/journals/${entry.journalId}`}
        });

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
                            items: { $ref: '#/components/schemas/Entry' }
                        },
                    },
                },
            },
        },
    };

    return operations;
}