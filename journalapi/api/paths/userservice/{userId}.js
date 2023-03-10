module.exports = function () {
  const db = require("../../../db.js");
  const { deleteUser, patchUpdateUser } = require("../../../streams/kafka.js");

  let operations = {
    GET,
    PATCH,
    DELETE,
  };

  async function GET(req, res, next) {
    console.log("GET /users/:userId");
    //find one user by id
    console.log("req.params:", req.params);

    try {
      const database = await db.connectDatabase();
      const user = await database
        .collection("Users")
        .findOne({ userId: parseInt(req.params.userId) });
      //set links for users journals , by looping through the journal array (which contains journal ids)
      //for each journal id, set a link to /journals/:id

      for (let i = 0; i < user.journals.length; i++) {
        const journalId = user.journals[i];
        user.journals[i] = {
          journalId: `http://localhost:5050/journals/${journalId}`,
        };
      }

      //return users
      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async function PATCH(req, res, next) {
    console.log("PATCH /users/:userId");
    console.log("req.params:", req.params);
    console.log("req.body:", req.body);
    try {

      //add the userId to the body
      req.body.userId = parseInt(req.params.userId);
      //No database update, just send to kafka
      await patchUpdateUser("userUpdated", req.body);
      res.status(200).json({ message: "User updated" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async function DELETE(req, res, next) {
    console.log("DELETE /users/:userId");
    console.log("req.params:", req.params);
    try {
      
      //No database update, just send to kafka
      //send the userId to kafka as a json body, so it can be parsed in the consumer
      const userIdJson = {
        userId: parseInt(req.params.userId)
      }
      await deleteUser("userDeleted", userIdJson);
      res.status(200).json({ message: "User deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  GET.apiDoc = {
    summary: "Get a user by id",
    description: "Get a user by id",
    operationId: "getUserById",
    parameters: [
      {
        in: "path",
        name: "userId",
        schema: {
          type: "integer",
          format: "int64",
        },
        required: true,
        description: "The id of the user to get",
      },
    ],
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/user",
            },
          },
        },
      },
    },
  };

  PATCH.apiDoc = {
    summary: "Update a user by id",
    description: "Update a user by id",
    operationId: "updateUserById",
    parameters: [
      {
        in: "path",
        name: "userId",
        schema: {
          type: "integer",
          format: "int64",
        },
        required: true,
        description: "The id of the user to update",
      },
    ],
    requestBody: {
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/user",
          },
        },
      },
    },
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "User updated successfully",
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
                },
              },
            },
          },
        },
      },
    },
  };
  
  

  DELETE.apiDoc = {
    summary: "Delete a user by id",
    description: "Delete a user by id",
    operationId: "deleteUserById",
    parameters: [
      {
        in: "path",
        name: "userId",
        schema: {
          type: "integer",
          format: "int64",
        },
        required: true,
        description: "The id of the user to delete",
      },
    ],
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: {
              type: "object",

              properties: {
                message: {
                  type: "string",
                  example: "User deleted",
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
