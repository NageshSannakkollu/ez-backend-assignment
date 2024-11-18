const path = require("path");
const multer = require("multer")
const FileModel = require("../models/File")
const fs = require("fs")

const storage = multer.diskStorage({
    destination:(req,file,cb)=> {
        if(!fs.existsSync(__dirname+'/uploads')){
            fs.mkdirSync(__dirname+'/uploads')
        }
        cb(null,'./uploads');
    },
    filename:(req,file,cb) => {
        cb(null,`${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/png','image/jpg','image/jpeg','application/pdf'];
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null,true)
    }else {
        cb(new Error("Invalid file type"));
    }
};

const upload = multer({storage,limits:{fileSize:1024*1024*5},
fileFilter,
}).single('file');

const uploadFile =async(req,res) => {
    try{
        if(!req.file){
            return res.status(400).json({message:'No file uploaded'})
        }
        const newFile = new FileModel({
            file_name:req.file.originalname,
            file_type:req.file.mimetype,
            encrypted_url:req.file.path
        })

        const saveFile = await newFile.save()
        res.status(200).json({
            message:'File uploaded Successfully',
            file:saveFile
        });
        }
        catch(error){
            res.status(500)
            res.send({error:error.message})
        }
}

//Download file

const downloadFile = async(req,res) => {
    const {filename} = req.params;
    const filePath = path.join(__dirname,'/uploads',filename)
    res.download(filePath,(err) => {
        if(err){
            console.log("Error:",err)
            return res.status(400).json({message:"File not Found"})
        }
    })
}
module.exports = {uploadFile,downloadFile};