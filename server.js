const express = require("express")
const bcrypt = require("bcryptjs")
const path = require('path');
const app = express();
const DBConnection = require("./config/db")
const fileRoutes = require('./routes/fileRoutes')
const userRouter = require("./routes/authRoutes")
const port = process.env.PORT || 3006;

app.use(express.json())
app.use("/uploads",express.static(path.join(__dirname,'uploads')))
// app.use('/uploads',express.static(path.join(__dirname,'uploads')))
app.use('/',fileRoutes)
app.use("/",userRouter)

DBConnection();
app.listen(port,(() => {
    console.log(`Server Running at :http://localhost:${port}/`)
}))



app.get("/",async(req,res) => {
    res.status(200).send("Hello World")
})
