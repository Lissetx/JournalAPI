module.exports = function () {
  const db = require("../../../db.js");
  const  {postCreateUser}   = require("../../../streams/kafka.js");

  let operations = {
    GET,
    POST,
  };

  async function GET(req, res, next) {
    console.log("GET /userservice");
    console.log("req.params:", req.params);
    console.log("we've got a request for all users");
    try {
      const dbconnection = await db.connectDatabase();
      const users = await dbconnection.collection("Users").find({}).toArray();
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
            journalId: `http://localhost:5053/journals/${journalId}`,
          };
        }
      }

      //return users
      console.log("Users with links:", users);
      res.status(200).json(users);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }

  async function POST(req, res, next) {
    console.log("POST /userservice");
    console.log("req.body:", req.body);
    //send to kafka
    try {
      await postCreateUser( "userCreated" , req.body);
      //return user but with a link to the journal
      const user = req.body;
      res.status(201).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  GET.apiDoc = {
    summary: "Get all users",
    description: "Get a list of all users",
    operationId: "getUsers",
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: { $ref: "#/components/schemas/user" },
            },
          },
        },
      },
    },
  };

  POST.apiDoc = {
    summary: "Create a new user",
    description: "Create a new user",
    operationId: "createUser",
    requestBody: {
      description: "User object that needs to be added to the database",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/user",
          },
        },
      },
      required: true,
    },
    responses: {
      201: {
        description: "Created",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Entry created",
                },
              },
            },
          },
        },
      },
      500: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Internal server error",
                }
              }
            }
          }
        }
      }
    },
  };

  return operations;
};
