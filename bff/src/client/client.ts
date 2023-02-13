let fs = require("fs")

let EasySock = require("easy_sock")

let protoBuffer = require("protocol-buffers")
let schemas = protoBuffer(fs.readFileSync(`${__dirname}/../entity.proto`))
let easySock = new EasySock({
    ip: '127.0.0.1',
    port: 3003,
    timeout: 5000,
    keepAlive: true // 全双工通信
})

easySock.encode = function(data, seq) {
    const body = schemas.ColumnRequest.encode(data);

    const head = Buffer.alloc(8);
    head.writeInt32BE(seq);
    head.writeInt32BE(body.length, 4);

    return Buffer.concat([head, body])
}
easySock.decode = function(buffer) {
    const seq = buffer.readInt32BE();
    const body = schemas.ColumnResponse.decode(buffer.slice(8));
    return {
        result: body,
        seq
    }
}
easySock.isReceiveComplete = function(buffer) {
    if (buffer.length < 8) {
        return 0
    }
    const bodyLength = buffer.readInt32BE(4);

    if (buffer.length >= bodyLength + 8) {
        return bodyLength + 8

    } else {
        return 0
    }
}

module.exports = easySock;