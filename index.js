//ASSIGNMENT 4
const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const app = express();
const port = 3000;
app.use(express.json());
// const readFile = (filePath)=>{
//     filePath = path.resolve(filePath);
//     const data = fs.readFileSync(filePath, 'utf-8');
//     JSON.parse(data);
// };

function readFileData() {
  return JSON.parse(fs.readFileSync("users.json", "utf-8"));
}
/* 1. Create an API that adds a new user to your users stored in a JSON file. (ensure that the email of the new user doesn’t exist before)(1
Grades)
o URL: POST /user*/
app.post("/user", (req, res, next) => {
  //destructuring the request body
  const { name, email, password } = req.body;
  //reading existing users from the file
  const users = readFileData();
  //checking if email already exists
  userExists = users.find((user) => user.email === email);
  //if exists send error response
  if (userExists) {
    return res
      .status(409)
      .json({ message: "user already exists", success: false });
  }
  //if not exists add new user to the users array
  users.push({ name, email, password, userId: users.length + 1 });
  //write updated users array back to the file
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  //send success response
  res.status(201).json({ message: "user added successfully", success: true });
});

/* 2. Create an API that updates an existing user's name, age, or email by their ID. The user ID should be retrieved from the params. (1 Grade)
 Note: Remember to update the corresponding values in the JSON file*/

app.patch("/user/:id", (req, res, next) => {
  //destructuring the request body
  const { id } = req.params;
  //check if user with given id exists
  const users = readFileData();
  const userExists = users.findIndex((user) => user.userId === parseInt(id));
  //if exists update the user details
  if (userExists === -1) {
    return res.status(404).json({ message: "user not found", success: false });
  }
  //write updated users array back to the file
  Object.assign(users[userExists], req.body);
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  //send success response
  return res
    .status(200)
    .json({ message: "user updated successfully", success: true });
});

/*3. Create an API that deletes a User by ID. The user id should be retrieved from either the request body or optional params. (1 Grade)
Note: Remember to delete the user from the file
o URL: DELETE /user{/:id} */

app.delete("/user/:id", (req, res, next) => {
  //destructuring the id from params
  const { id } = req.params;
  //check if user with given id exists
  const users = readFileData();
  const userIndex = users.findIndex((user) => user.userId === parseInt(id));
  if (userIndex === -1) {
    return res.status(404).json({ message: "user not found", success: false });
  }
  //if exists delete the user
  users.splice(userIndex, 1);
  //write updated users array back to the file
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  //send success response
  res.status(200).json({ message: "user deleted successfully", success: true });
});

/**Create an API that gets a user by their name. The name will be provided as a query parameter. (1 Grade)
o URL: GET /user/getByName */
app.get("/user/name", (req, res, next) => {
  //destructing the name from query params
  const { name } = req.query;
  const users = readFileData();
  //check name existing
  const userExist = users.find((user) => user.name === name);
  //if exists return user details
  if (userExist) {
    return res
      .status(200)
      .json({ message: "user found", success: true, data: userExist });
  }
  //if not exists return user not found
  res.status(404).json({ message: "user not found", success: false });
});

/**5. Create an API that gets all users from the JSON file. (1 Grade)
o URL: GET /user */
app.get("/user", (req, res, next) => {
  //read file data
  const users = readFileData();
  usersExist = users.length > 0;
  //if no users found return appropriate message
  if (!usersExist) {
    return res.status(404).json({message:"no users found", success:false});
  }
  //return all users
  return res.status(200).json({message:"users found users are:", success:true, data:users});
});

/*Create an API that filters users by minimum id. (1 Grade)
o URL: GET /user/filter*/
app.get("/user/id",(req,res,next)=>{
    //destructuring minAge from query params
    const {id} = req.query;
    //parsing minAge to integer
    // const minId = parseInt(id);
    //reading users from file
    const users = readFileData();
    //filtering users based on minAge
    userFiltered = users.filter((user)=> user.userId >= id);
    //if no users found return appropriate message
    if(userFiltered.length === 0){
        return res.status(404).json({message:"no users found with the given age", success:false});
    }
    //return filtered users
    return res.status(200).json({message:"users found", success:true, data:userFiltered});
})

//listening on port 3000
app.listen(port, () => {
  console.log("application is running on port " + port);
});
