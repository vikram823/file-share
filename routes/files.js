const express = require("express");
const router = new express.Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/files");
const { v4: uuid4 } = require("uuid");
const {sendEmail} = require("../services/emailServices");

// start
router.get("/", async(req, res)=>{
  res.render("home");
})

const storage = multer.diskStorage({
  destination: (req, res, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, res, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(res.originalname)}`;

    callback(null, uniqueName);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 100000 * 100,
  },
}).single("myFile");

// file upload
router.post("/api/files", upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ error: "All fields required" });
    }

    const file = await new File({
      fileName: req.file.originalname,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });

    if (!file) {
      res.json({ error: "No file" });
    }

    const response = await file.save();
    res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// email send
router.post("/api/files/send", async (req, res) => {
  
  const {uuid, emailTo, emailFrom} = req.body;
  
  try {
    if(!uuid || !emailTo || !emailFrom){
      return res.status(422).send({error: "All fields required"});
    }

    const file = await File.findOne({uuid});

    if(file.sender){
      return res.status(422).send({error: "Email already sent"});
    }

    file.sender = emailFrom;
    file.recevier = emailTo;
    const response = await file.save();

    sendEmail({
      from: emailTo, 
      to: emailFrom,
      subject: "File shared",
      text: "",
      html: require("../services/emailTemplate")({
        emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
        size: parseInt(file.size/1000) + "Kb",
        expires: "24 Hours"
      })
    });

    res.status(200).send({success: true});

  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

module.exports = router;
