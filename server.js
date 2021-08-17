require("dotenv").config();
const express = require("express");
require("./config/db");
const filesRouter = require("./routes/files");
const showRouter = require("./routes/show");
const downloadRouter = require("./routes/download");
const path = require("path");

const app = express();

const PORT= process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(filesRouter);
app.use(showRouter);
app.use(downloadRouter);

app.listen(PORT, ()=>{
    console.log(`app listening on port ${PORT}`);
})