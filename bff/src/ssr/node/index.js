const app = new (require('koa'));
const mount = require('koa-mount');
const serveStatic = require('koa-static');
const getData = require('./get-data')
const ReactDOMServer = require('react-dom/server');
const App = require('./app.jsx')
const template = require('./template')(__dirname + '/index.htm')

app.use(mount('/static', serveStatic(__dirname + '/../../static')))

app.use(mount('/data', async (ctx) => {
    ctx.body = await getData(+(ctx.query.sort || 0), +(ctx.query.filt || 0));
}));

app.use(async (ctx) => {
    ctx.status = 200;
    const filtType = +(ctx.query.filt || 0)
    const sortType = +(ctx.query.sort || 0);
    const reactData = await getData(sortType, filtType);
    // console.log(ReactDOMServer.renderToString(ReactRoot));

    let html = template({
        reactString: ReactDOMServer.renderToString(
            App(reactData)
        ),
        reactData,
        filtType,
        sortType
    });

    // console.log(`result ${html}`)
    ctx.body = html;
    // ctx.body = 200;
})


app.listen(3000,() => {
    console.log("listen to 3000 !!!")
})
// module.exports = app;