module.exports = function(){
    const db = require('../../../db.js') ;

    let operations = {
        GET
    }

    async function GET(req, res, next){
        console.log("GET /users/:userId");
        //find one user by id
        const database = db.connectDatabase();
        const user = await database.collection('users').findOne({id: parseInt(req.params.userId)});
        //set links for users journals , by looping through the journal array (which contains journal ids)
        //for each journal id, set a link to /journals/:id

        user.journals.forEach(journal => {
            //http://localhost:loadbalancerport/journals/:id
            journal.links = {journal: `/journals/${journal.id}`}
        });

        //return users
        res.status(200).json(user);
    }

    GET.apiDoc = {
        summary: 'Get a user by id',
        description: "Get a user by id",
        operationId: 'getUserById',
        parameters: [
            {
                in: 'path',
                name: 'userId',
                schema: {
                    type: 'integer',
                    format: 'int64',
                },
                required: true,
                description: 'The id of the user to get',
            },
        ],
        responses : {
            200: {
                description: 'OK',
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                },
            },
        },
    };

    return operations;
}