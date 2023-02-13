/**
 * 通过graphQL 从后端抓取数据 ...
 *
 * 根据后端提供的数据,抓取自己想要的数据...
 *
 *
 * 本质上也可以用在后端的数据请求中 ....
 *
 * 这里展示 视频播放详情 ....(页面) ..
 */


const koa = require('koa')
const mount = require('koa-mount')
const {graphqlHTTP}  = require("koa-graphql")
const staticHelper = require('koa-static')

const fs = require('fs')

const app = new koa()

app.use(
    mount(
        '/api',graphqlHTTP({
            schema: require('./schema')
        })
    )
)

app.use(
    mount('/static', staticHelper(`${__dirname}/../static`))
)

app.use(
    mount('/', async (ctx) => {
        ctx.status = 200;

        ctx.body = fs.readFileSync(`${__dirname}/index.html`, 'utf-8')
    })
)

// module.exports = app;
app.listen(3000)

