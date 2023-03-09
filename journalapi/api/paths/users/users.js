module.exports = function(){
   const db = require('../../../db.js') 

   let operations = {
    GET 
   }

   async function GET(req, res, next){
    console.log("GET /users");
    const database = db.connectDatabase();
    const users = await database.collection('users').find().toArray();
    //set links for users journals , by looping through the journal array (which contains journal ids)
    //for each journal id, set a link to /journals/:id

    users.journals.forEach(journal => {
        //http://localhost:loadbalancerport/journals/:id
        journal.links = {journal: `/journals/${journal.id}`}
    });

    //return users
    res.status(200).json(users);
    }

    GET.apiDoc = {
        summary: 'Get all users',
        description: "Get a list of all users",
        operationId: 'getUsers',
        responses : {
            200: {
                description: 'OK',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/User' }
                        },
                    },
                },
            },
        },
    };

    return operations;

};