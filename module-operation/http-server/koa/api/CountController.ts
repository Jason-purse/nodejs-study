let mount = require("koa-mount")
let count = 0;
module.exports.mount = function(app) {
    app.use(mount("/count/incr",function(ctx,next) {
        count ++;
        next();
        ctx.response.status = 200
        ctx.response.body = "success"
    }))

    app.use(mount("/count",function(ctx,next) {
        next();
        ctx.response.status = 200
        ctx.response.body = count
    }))
}