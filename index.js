//ASSIGNMENT 4 
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
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
app.post('/user',(req,res,next)=>{
    //destructuring the request body
    const {name , email,password}=req.body;
    //reading existing users from the file
    const users = readFileData();
    //checking if email already exists
    userExists = users.find((user) => user.email === email);
    //if exists send error response
    if(userExists){
        return res.status(409).json({message:"user already exists" , success:false})
    }
    //if not exists add new user to the users array
    users.push({name,email,password});
    //write updated users array back to the file
    fs.writeFileSync('users.json',JSON.stringify(users,null,2));
    //send success response
    res.status(201).json({message:"user added successfully", success:true});
});




//listening on port 3000
app.listen(port, () => { 
    console.log("application is running on port " + port);
});