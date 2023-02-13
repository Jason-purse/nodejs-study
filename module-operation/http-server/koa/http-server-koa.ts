// koa 是一个express 框架的替代品 ..
//由于本身express 过滤链的缺陷(也就是异步函数的逃狱,导致它的过滤链 - 中间件能力使用不当则导致 出现较大的问题(例如代码执行顺序错误)) ..
// 所以通过koa (支持异步函数处理的中间件能力来解决这个问题) ..


let path = require("path");

let koa = require("koa")
let mount = require("koa-mount")
let fs = require("fs")

let routers = require("./Routers.ts")

// 组装一个大型的koa 应用(可以由许多小的koa 应用组成) ..

let root = new koa();

routers.forEach(router => {
    // mount ..
    root.use(mount(router.path, router.app))
})

root.use(mount("/test", async function(ctx,next) {
    // 中间件测量 执行时间 ..
    const startTime = new Date().getTime();
    await next();
    const endTime = new Date().getTime();

    console.log(`consume time is ${endTime - startTime}`)
    ctx.response.body = `test consume time ${endTime - startTime}`
}))

// 挂载第二个中间件 ..
root.use(mount("/test",function (ctx,next) {
    console.log("第二个test middleware handle")
    next()
}))

// 这里的匹配,依旧是存在问题的,原因是, 这些插件本身应该都是依次执行的,也就是说, /api/count ,它符合 '/',如果我们不提供next()的形式让它先执行,直接返回,这将导致问题 ....
root.use(mount("/", function (ctx, next) {
    next();
    // console.log(`request url: ${ctx.request.url}`)
    if (ctx.request.url == "/") {
        ctx.response.status = 200
        ctx.response.type = "text/html"
        ctx.response.body = fs.readFileSync(path.resolve(__dirname, "../index.html"))
    }
    // 只能在这里实现兜底策略
    else {
        ctx.response.type = "text/html"
        ctx.response.status = 400
        ctx.response.body = "404"
    }
    // ctx.response.body = "你好"
}))

// 兜底路由 ..
// 不存在 /* 兜底的策略, 所以无法实现这种兜底策略 ..
// root.use(mount("/*",async function (ctx,next) {
//     next()
//     console.log("兜底路由 ...")
//     ctx.response.status = 404
//     ctx.body = 404
// }))





root.listen(3001, () => {
    console.log("listen on 3001 !!!")
})
