module.exports = function(){
   const db = require('../../../db.js') 

   let operations = {
    GET 
   }

   async function GET(req, res, next){
    console.log("GET /userservice");
    console.log("req.params:", req.params);
    console.log("we've got a request for all users");
    try{
    const dbconnection = await db.connectDatabase();
    const users = await dbconnection.collection('Users').find({}).toArray();
    console.log("Users from DB:", users);
    //set links for users journals , by looping through the journal array (which contains journal ids)
    //for each journal id, set a link to /journals/:id

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        // Loop through the journals array of each user object
        for (let j = 0; j < user.journals.length; j++) {
          const journalId = user.journals[j];
          // Set the links property of the journal object
          user.journals[j] = {
            journalId: `http://localhost:5050/journals/${journalId}`
          
          };
        }
        }

    //return users
    console.log("Users with links:", users);
    res.status(200).json(users);
    }catch (err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
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
                            items: { $ref: '#/components/schemas/user' }
                        },
                    },
                },
            },
        },
    };

    return operations;

};