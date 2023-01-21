const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

//DB Connection
const connection = require("./Config/db");

//RegisterModel
const RegisterModel = require("./Models/registerModel");

//Middleware

const authenticate = require("./Middlewares/getProfile");

app.get("/", (req, res) => {
  res.send("Welcome To grow Calculator");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const email_exists = await RegisterModel.findOne({ email });
  if (email_exists?.email) {
    res.send("Email already exist");
  } else {
    try {
      bcrypt.hash(password, 12, async (err, hashpass) => {
        const registeruser = new RegisterModel({
          name,
          email,
          password: hashpass,
        });
        await registeruser.save();
        res.send("Signup Successfully");
      });
    } catch (error) {
      console.log("Somthing error in singup function");
      console.log(error);
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const regiterUser = await RegisterModel.find({ email });
    if (regiterUser.length > 0) {
      const hashed_password = regiterUser[0].password;
      bcrypt.compare(password, hashed_password, function (err, result) {
        if (result) {
          const token = jwt.sign({ userID: regiterUser[0]._id }, "mock12");
          res.send({
            msg: "Login Successful",
            token: token,
          });
        } else {
          res.send("Invalid Credentials");
        }
      });
    }
  } catch (error) {
    console.log("somthing Wrong in Login");
    console.log(error);
  }
});

// app.use(authenticate);
// app.get("/getProfile", async (req, res) => {
//   try {
//     const userData = req.body;
//     console.log(userData);
//     const user = await RegisterModel.findById({ _id: userData.userId });
//     res.send(user);
//   } catch (error) {
//     console.log(error);
//     res.send("somthing error in getProfile");
//   }
// });

app.listen("2003", async () => {
  try {
    await connection;
    console.log("Connected With DataBase");
  } catch (error) {
    console.log("Somthing error in server");
    console.log(error);
  }
  console.log("Listening on PORT 2003");
});
