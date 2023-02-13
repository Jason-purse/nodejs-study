let http = require('http')
let fs = require("fs")

// 这种东西,就耦合住了(因为所有的网页都是使用同一个变量) ..
let count = 0;

// 创建 一个简单的http 服务器
http.createServer((req, res) =>  {
    console.log(req.url)
    if(req.url.startsWith("/api/count/incr")) {
        count ++;
        // over ..
        res.end()
    }
    else if(req.url.startsWith("/api/count")) {
        res.end(`${count}`)
    }
    else {
        fs.createReadStream(__dirname + "/index.html").pipe(res)
    }
}).listen(3001,() => {
    console.log("listening on 3001 !!!")
})


// 当然也可以使用 http-server npm 包(一个静态http 资源服务器) ...


// 而且这上述的形式,也无法清楚的描述 所包含的功能 ..
// 所以需要使用框架 , express ..