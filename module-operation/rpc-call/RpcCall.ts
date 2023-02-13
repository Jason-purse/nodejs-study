// rpc call
// 使用二进制协议,更快,效率更高 .
// npm install protocol-buffers

// protocol-buffer 是google 开发的一个二进制协议 ..

let fs = require("fs");

let protoBuffer = require("protocol-buffers")
let schema = protoBuffer(fs.readFileSync(__dirname + "/entity.proto"))
let userBuffer = schema.User.encode({
    id: "1",
    "username": "jackson",
    "nickname": "smile boy",
    "email": "smileboy@foxmail.com"
})

console.log(userBuffer)

let rawData = schema.User.decode(userBuffer)
console.log(rawData)

