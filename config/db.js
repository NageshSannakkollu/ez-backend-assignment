const mongoose = require("mongoose");

const DBConnection = async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017/fileSharing',{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("DB Connected Successfully")
    } catch (err) {
        console.log(err)
    }
    
}

module.exports = DBConnection;