const RPC = require('./rpc-server.js');

/**
 * 因为所有服务用的包头格式都一样，不一样的只有protobuf协议，所以这里可以将这段逻辑封成一个模块
 *
 * 日常做项目的时候一定要注意把重复代码做封装
 */
module.exports = function (protobufRequestSchema, protobufResponseSchema) {
    return new RPC({
        // 解码请求包
        decodeRequest(buffer) {
            const seq = buffer.readUInt32BE();
            return {
                seq: seq,
                result: protobufRequestSchema.decode(buffer.slice(8))
            }
        },
        // 判断请求包是不是接收完成
        isCompleteRequest(buffer) {
            if(buffer.length < 8) {
                return 0;
            }

            const bodyLength = buffer.readUInt32BE(4);

            if(bodyLength + 8 <= buffer.length) {
                return 8 + bodyLength
            }

            // 否则表示残缺包 ..
            return 0;
        },
        // 编码返回包
        encodeResponse(data, seq) {
            const body = protobufResponseSchema.encode(data);

            const head = Buffer.alloc(8);
            head.writeUInt32BE(seq);
            head.writeUInt32BE(body.length, 4);

            return Buffer.concat([head, body]);
        }
    })
}