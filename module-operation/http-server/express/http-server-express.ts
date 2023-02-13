let express = require("express")
let server = express()
let path = require("path")

let count = 0;

server.get("/",(req,res) => {
    res.sendFile(path.resolve(__dirname,"../index.html"))
})

server.get("/api/count/incr",(req,res) => {
    count ++;
    res.status(200).send("success")
})

server.get("/api/count",(req,res) => {
    res.status(200).send(`${count}`);
})




// listen
server.listen(3001,() => {
    console.log("listen on 3001 !!!")
})

