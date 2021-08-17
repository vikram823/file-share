const mongoose  = require("mongoose")


mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useCreateIndex : true,
    useUnifiedTopology :true,
    useFindAndModify:false
}).then( ()=>{
    console.log("connected successfully");
}).catch((err)=>{
    console.log(err);
});