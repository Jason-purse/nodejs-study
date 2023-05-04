var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// 'use strict';
// const debug = require("debug")('easysock-server');
var net = require("net");
var RPC = /** @class */ (function () {
    function RPC(_a) {
        var encodeResponse = _a.encodeResponse, decodeRequest = _a.decodeRequest, isCompleteRequest = _a.isCompleteRequest;
        this.encodeResponse = encodeResponse;
        this.decodeRequest = decodeRequest;
        this.isCompleteRequest = isCompleteRequest;
    }
    RPC.prototype.createServer = function (callback) {
        var _this = this;
        var buffer = null;
        var tcpServer = net.createServer(function (socket) {
            socket.on('data', function (data) {
                buffer = (buffer && buffer.length > 0) ?
                    Buffer.concat([buffer, data]) : // 有遗留数据才做拼接操作
                    data;
                var checkLength = null;
                var _loop_1 = function () {
                    var requestBuffer = null;
                    // 说明没有多余 ..
                    if (checkLength == buffer.length) {
                        requestBuffer = buffer;
                        buffer = null;
                    }
                    else {
                        requestBuffer = buffer.slice(0, checkLength);
                        buffer = buffer.slice(checkLength);
                    }
                    var request = _this.decodeRequest(requestBuffer);
                    callback({
                        body: request.result,
                        socket: socket
                    }, {
                        end: function (data) {
                            var buffer = _this.encodeResponse(data, request.seq);
                            socket.write(buffer);
                        }
                    });
                };
                while (buffer && (checkLength = _this.isCompleteRequest(buffer))) {
                    _loop_1();
                }
            });
        });
        return {
            listen: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                tcpServer.listen.apply(tcpServer, __spreadArray([], args, true));
            }
        };
    };
    return RPC;
}());
module.exports = RPC;
