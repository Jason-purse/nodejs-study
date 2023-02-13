/**
 * 通过 node-js 形成中台服务 ...
 *
 * nodemon 快速监听node.js 服务器中的文件改变,快速生效 ...
 *
 * 
 *
 */

let koa = require("koa")
let mount = require("koa-mount")
let staticHelper = require("koa-static")
let fs = require("fs")


let app = new koa();

// 表示静态文件 ..
// 例如根据请求路径从对应的文件路径下寻找文件 ...
app.use(staticHelper(__dirname + "/src"))


// 在启动backend 下面的node server 进行rpc 通信时,不需要它,因为通过模板引擎实现 ...
// 兜底操作 ..
// app.use(mount('/', ctx => {
//     ctx.body = fs.readFileSync(__dirname + "/src/index.htm","utf-8")
// }))


// 普通的index 首页渲染不需要它以下三行代码 ...
let templateEngine = require("./src/template/FulltemplateEngine.js")
let client = require("./src/client/client.ts")
let templateFile = `${__dirname}/src/template/index.html`

app.use(mount('/', async ctx => {

    if (!ctx.query.columnid) {
        ctx.status = 400
        ctx.body = "miss parameter ..."
        return;
    }

    let result = await new Promise((resolve, reject) => {
        client.write({
            columnid: ctx.query.columnid
        }, (error, result) => {
            if (error) {
                reject(error)
            }
            resolve(result)
        })
    })

    ctx.status = 200
    let html = templateEngine(templateFile)(result)
    ctx.body = Buffer.from(html);
    // 普通index 页面渲染打开它 ...(也就是简单使用node.js 渲染一个index.html ...
    // ctx.body = fs.readFileSync(`${__dirname}/index.htm`)

}))


app.listen("3001", () => {
    console.log("listen to 3001 !!!")
})

