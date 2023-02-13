/**
 * 启动后台服务器 ...
 * 这里模拟后端服务器 ..
 */

const fs = require("fs")
const protobuf = require("protocol-buffers")
const schemas = protobuf(
    fs.readFileSync(`${__dirname}/../entity.proto`)
)

const columnData = require("./mock-data/column")
const server = require('./lib/geeknode-rpc-server')

// 单独的一个针对栏目的一个服务端 rpc 调用请求 schema 定义 ..
let backend = server(schemas.ColumnRequest,schemas.ColumnResponse)

backend.createServer((request, response) => {
    // 因为都是假数据，这里就没有使用栏目id。真实项目会拿这个columnid去请求数据库
    const columnid = request.body;

    // 通过回调的形式,将request  / response 暴露,并提供了end 函数,可以返回假的栏目信息 ..
    // 直接返回假数据

    console.log("response ....")
    response.end({
        column: columnData[0],
        recommendColumns: [columnData[1], columnData[2]]
    });
}).listen(3003,() => {
    console.log("listen to 3003 ...")
})
