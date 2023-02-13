// 'use strict';
// const debug = require("debug")('easysock-server');
const net = require("net");

type RPCProps = {
    encodeResponse: Function,
    decodeRequest: Function,
    isCompleteRequest: Function,
}

 class RPC implements RPCProps {
  readonly encodeResponse: Function;
  readonly decodeRequest: Function;
  readonly isCompleteRequest: Function;

    constructor({ encodeResponse, decodeRequest, isCompleteRequest }: RPCProps) {
        this.encodeResponse = encodeResponse;
        this.decodeRequest = decodeRequest;
        this.isCompleteRequest = isCompleteRequest;
    }

    createServer(callback) {
        let buffer = null;
        const tcpServer = net.createServer((socket) => {

            socket.on('data', (data) => {
                buffer = (buffer && buffer.length > 0) ?
                    Buffer.concat([buffer, data]) : // 有遗留数据才做拼接操作
                    data;

                let checkLength = null;
                while (buffer && (checkLength = this.isCompleteRequest(buffer))) {
                    let requestBuffer = null;

                    // 说明没有多余 ..
                    if (checkLength == buffer.length) {
                        requestBuffer = buffer;
                        buffer = null;

                    } else {
                        requestBuffer = buffer.slice(0, checkLength);
                        buffer = buffer.slice(checkLength);
                    }

                    const request = this.decodeRequest(requestBuffer);

                    callback(
                        { // request
                            body: request.result,
                            socket
                        },
                        { // response
                            end: (data) => {
                                const buffer = this.encodeResponse(data, request.seq)
                                socket.write(buffer);
                            }
                        }
                    );
                }
            })
        });

        return {
            listen(... args) {
                tcpServer.listen.apply(tcpServer, [... args])
            }
        }
    }
}



module.exports =  RPC