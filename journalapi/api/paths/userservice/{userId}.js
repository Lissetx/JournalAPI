module.exports = function(){
    const db = require('../../../db.js') ;

    let operations = {
        GET
    }

    async function GET(req, res, next){
        console.log("GET /users/:userId");
        //find one user by id
        console.log("req.params:", req.params);

        try{
        const database = await db.connectDatabase();
        const user = await database.collection('Users').findOne({userId: parseInt(req.params.userId)});
        //set links for users journals , by looping through the journal array (which contains journal ids)
        //for each journal id, set a link to /journals/:id

        for (let i = 0; i < user.journals.length; i++) {
            const journalId = user.journals[i];
            user.journals[i] = {journalId: `http://localhost:5050/journals/${journalId}`};
        }

        //return users
        res.status(200).json(user);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
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
                            $ref: '#/components/schemas/user',
                        },
                    },
                },
            },
        },
    };

    return operations;
}