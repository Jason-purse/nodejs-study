var net = require("net");
var socket = new net.Socket({});
socket.connect({
    port: 4000,
    host: '127.0.0.1'
});
var LESSONS = [
    "136797",
    "136798",
    "136799",
    "136800",
    "136801",
    "136803",
    "136804",
    "136806",
    "136807",
    "136808",
    "136809",
    "141994",
    "143517",
    "143557",
    "143564",
    "143644",
    "146470",
    "146569",
    "146582"
];
var id = Math.floor(Math.random() * LESSONS.length);
var oldBuffer = null;
socket.on('data', function (buffer) {
    if (oldBuffer) {
        buffer = Buffer.concat([oldBuffer, buffer]);
    }
    var completeLength = 0;
    // 只要还存在可以解成完整包的包长
    while (completeLength = checkComplete(buffer)) {
        var package = buffer.slice(0, completeLength);
        buffer = buffer.slice(completeLength);
        // 把这个包解成数据和seq
        var result = decode(package);
        console.log("\u5305".concat(result.seq, "\uFF0C\u8FD4\u56DE\u503C\u662F").concat(result.data));
    }
    // 把残余的buffer记下来
    oldBuffer = buffer;
});
var seq = 0;
/**
 * 二进制包编码函数
 * 在一段rpc调用里，客户端需要经常编码rpc调用时，业务数据的请求包
 */
function encode(data) {
    // 正常情况下，这里应该是使用 protobuf 来encode一段代表业务数据的数据包
    // 为了不要混淆重点，这个例子比较简单，就直接把课程id转buffer发送
    var body = Buffer.alloc(4);
    var id = Number.parseInt(LESSONS[data.id]);
    body.writeInt32BE(id);
    // 一般来说，一个rpc调用的数据包会分为定长的包头和不定长的包体两部分
    // 包头的作用就是用来记载包的序号和包的长度，以实现全双工通信
    var header = Buffer.alloc(6);
    header.writeInt16BE(seq);
    header.writeInt32BE(body.length, 2);
    // 包头和包体拼起来发送
    var buffer = Buffer.concat([header, body]);
    console.log("\u5305".concat(seq, "\u4F20\u8F93\u7684\u8BFE\u7A0Bid\u4E3A").concat(LESSONS[data.id]));
    seq++;
    return buffer;
}
/**
 * 二进制包解码函数
 * 在一段rpc调用里，客户端需要经常解码rpc调用时，业务数据的返回包
 */
function decode(buffer) {
    var header = buffer.slice(0, 6);
    var seq = header.readInt16BE();
    var body = buffer.slice(6);
    return {
        seq: seq,
        data: body.toString()
    };
}
/**
 * 检查一段buffer是不是一个完整的数据包。
 * 具体逻辑是：判断header的bodyLength字段，看看这段buffer是不是长于header和body的总长
 * 如果是，则返回这个包长，意味着这个请求包是完整的。
 * 如果不是，则返回0，意味着包还没接收完
 * @param {} buffer
 */
function checkComplete(buffer) {
    if (buffer.length < 6) {
        return 0;
    }
    var bodyLength = buffer.readInt32BE(2);
    return 6 + bodyLength;
}
for (var k = 0; k < 100; k++) {
    id = Math.floor(Math.random() * LESSONS.length);
    socket.write(encode({ id: id }));
}
