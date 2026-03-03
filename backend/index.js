// const express=require("express")
// const mongoose=require("mongoose")
// const cors=require("cors")
// const UserModel = require("./models/Users");


// const app=express()
// app.use(express.json())
// app.use(cors())


// mongoose.connect("mongodb://127.0.0.1:27017/users");
// app.post("/signup",(req,res)=>{
// UserModel.create(req.body)
// .then(users=>res.json(users))
// .catch(err=>res.json(err))
// })
// app.listen(3001,()=>{
//   console.log("server is running")
// })





// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   // Check if user exists
//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(400).json({ message: "User not found" });
//   }

//   // Compare password
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     return res.status(400).json({ message: "Invalid password" });
//   }

//   // Generate token (optional but recommended)
//   const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });

//   res.json({
//     message: "Login successful",
//     token,
//   });
// });




const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("./models/Users.js");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/users")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ================= SIGNUP ================= */

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.json({
      message: "Signup successful",
      user: newUser
    });

  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err });
  }
});

/* ================= LOGIN ================= */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "Account inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "secretKey123",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
});
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});