const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const UserModel = require("../models/User")
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const DBConnection = require("../config/db")



const registerUser = async(req,res) => {
    try{
        const {username,email,password,role} = req.body;    
        const hashedPassword = await bcrypt.hash(password,10)
        console.log(hashedPassword)
        const user = {
            username:username,
            email:email,
            password:hashedPassword,
            role:role
        }
        // console.log("User:",user)

    // Check if the user is already registered.
        const existingUser = await UserModel.findOne({ email: user.email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }
        await UserModel.create(user)
        .then((user) => {
        res.status(200).json({
          message: "Registration successful",
          user,
        });
      })
      .catch((error) => {
        res.status(400).json({
          message: "Something went wrong",
        });
        console.log(error)
      });
    
    }catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};

// Login User 

const loginUser = async(req,res) => {
    const {email,password} = req.body;
    const user = await UserModel.findOne({email:email})
    console.log("User:",user)
    if(!user){
        return res.status(401).json({
            message:"User not found"
        })
    }
    const verifyPassword = await bcrypt.compare(password,user.password)
    if(verifyPassword){
        const payload = {
            email:email
        }
        const jwtToken = jwt.sign(payload,"my_secret_key");
        res.send({jwtToken})
    }else{
        res.status(400)
        res.send("Invalid password")
    }
}

//verify email-using nodemailer 

const verifyEmailAddress = async(req,res) => {
    const {email} = req.body;
    console.log("Email:",email)
    await DBConnection()
    const existingUser = await UserModel.findOne({email:email})
    if(existingUser){
        const token = crypto.randomBytes(32).toString('hex')
        console.log("Nano-token:",token)
        const transporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: "nagesh4a2@gmail.com",
                pass: "Ghajini@1438",
            },
        });

        const content = `Click here to <a href="http://localhost:3006/verify-email/${token}">Verify Email Address</a>`
        const resetLink = {
            from: '"Maddison Foo Koch 👻" <nagesh4a2@gmail.com>', // sender address
            to: emailId, // list of receivers
            subject: "verify link", // Subject line
            text: "verify email address", // plain text body
            html: content // html body
        }
        const info = await transporter.sendMail(resetLink)
        console.log("Message sent: %s", info.messageId);
        const response = await UserModel.findOneAndUpdate({email:email},{verifytoken:token},{email_verified:true})
        console.log("update Response:",response)
    }else{
        console.log("No record found")
    }
}

module.exports = {registerUser,loginUser,verifyEmailAddress}