const express = require("express")
const router = express.Router()
const {uploadFile, downloadFile} = require("../controllers/fileController.js")

router.post("/upload",uploadFile)
router.get("/download/:filename",downloadFile)

module.exports = router;