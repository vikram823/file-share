const express = require("express");
const router = new express.Router();
const File = require("../models/files");

router.get("/files/:uuid", async(req, res)=>{
    try {
        
        const file = await File.findOne({uuid: req.params.uuid})
        if(!file){
            res.status(404).render("download", {error: "No files"});
        }

        res.render("download",{
            uuid: file.uuid,
            fileName: file.fileName,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        });

    } catch (e) {
        res.status(500).render("download", {error: "something went wrong"});
    }
})

module.exports = router;