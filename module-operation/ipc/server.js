var net = require("net");
var server = net.createServer(function (socket) {
    var oldBuffer = null;
    socket.on("data", function (buffer) {
        // 把上一次data 时间中使用的残留的buffer 提上来 ..
        if (oldBuffer) {
            buffer = Buffer.concat([oldBuffer, buffer]);
        }
        var packageLength = 0;
        while (packageLength = checkComplete(buffer)) {
            var packageData = buffer.slice(0, packageLength);
            buffer = buffer.slice(packageLength);
            var result = decode(packageData);
            console.log("send to client ..... seq: ".concat(result.data, ", lesson: ").concat(LESSON_DATA[result.data]));
            socket.write(encode(LESSON_DATA[result.data], result.seq));
        }
        // 剩余的就留下 ...
        oldBuffer = buffer;
    });
});
server.listen(4000);
/**
 * 二进制包编码函数
 *
 * 在一段rpc 调用中,服务端进场需要编码rpc调用的业务数据的返回包 ..
 * @param data data
 * @param seq seq
 */
function encode(data, seq) {
    // 正常情况下,这里通过protobuf 来编码一段业务数据的业务包 ..
    //  简单实现 ..
    var body = Buffer.from(data);
    // 一般来说,一个rpc调用的数据会分为定长的包头和不定长的包体两部分 ..
    // 包头通过记载包的序号和包的长度,实现全双工通信 ...
    var header = Buffer.alloc(6);
    header.writeInt16BE(seq);
    header.writeUint32BE(body.length, 2);
    return Buffer.concat([header, body]);
}
/**
 * 二进制包解码函数
 * 通常需要解码业务数据的响应包
 *
 * 这是一个完整的包,所以不需要解析header中的 bodyLength
 */
function decode(buffer) {
    var header = buffer.slice(0, 6);
    var seq = header.readInt16BE();
    // 解析body 拿到长度
    var body = buffer.slice(6).readInt32BE();
    return {
        seq: seq,
        data: body
    };
}
/**
 * 检查一个buffer 是不是一个不完整的数据包 ..
 * 具体逻辑就是判断 header的body - length 字段, buffer的总长度 大于 header + 包指定的长度 ...
 * 如果是则返回包长,这意味着请求包有多余 ..
 * 如果不是则返回0,表示没有接受完 ...
 * @param buffer buffer
 */
function checkComplete(buffer) {
    if (buffer.length < 6) {
        return 0;
    }
    var bodyLength = buffer.readInt32BE(2);
    // 保守估计(按道理来说只会存在粘住不完整的包) ...
    // 但是我宁愿写出这种形式 ...
    if (bodyLength < buffer.length) {
        return 6 + bodyLength;
    }
    return 0;
}
// 假数据
var LESSON_DATA = {
    136797: "01 | 课程介绍",
    136798: "02 | 内容综述",
    136799: "03 | Node.js是什么？",
    136800: "04 | Node.js可以用来做什么？",
    136801: "05 | 课程实战项目介绍",
    136803: "06 | 什么是技术预研？",
    136804: "07 | Node.js开发环境安装",
    136806: "08 | 第一个Node.js程序：石头剪刀布游戏",
    136807: "09 | 模块：CommonJS规范",
    136808: "10 | 模块：使用模块规范改造石头剪刀布游戏",
    136809: "11 | 模块：npm",
    141994: "12 | 模块：Node.js内置模块",
    143517: "13 | 异步：非阻塞I/O",
    143557: "14 | 异步：异步编程之callback",
    143564: "15 | 异步：事件循环",
    143644: "16 | 异步：异步编程之Promise",
    146470: "17 | 异步：异步编程之async/await",
    146569: "18 | HTTP：什么是HTTP服务器？",
    146582: "19 | HTTP：简单实现一个HTTP服务器"
};
