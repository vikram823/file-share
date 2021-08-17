const express = require("express");
const router = new express.Router();
const File = require("../models/files");

router.get("/files/download/:uuid", async(req, res)=>{
    try {
        
        const file = await File.findOne({uuid: req.params.uuid})
        
        if(!file){
            res.render("download", {error: "Link expired"});
        }

        const filePath = `${__dirname}/../${file.path}`;
        res.download(filePath);

    } catch (e) {
        res.render("download", {error: "something went wrong"});
    }
})

module.exports = router;