let koa = require("koa")

let api = new koa();

require("./CountController.ts").mount(api)


module.exports = {
    path: '/api',
    app: api
};