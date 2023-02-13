// 异步操作 ..

// 在Node.js 中,由于事件循环回调(这里说的是例如 timeout / 等时间任务) 都处于一个新的调用栈
// 所以我们不可能将错误抛出到全局引发Node.js 死亡 ,所以我们需要通过 传递错误到回调函数中 ..
// 然而,Node.js 提出了一种回调函数规范,也就是第一个参数作为错误实例,后序才是回调结果 ...

// 例如 async 库就是这样的规范产物 ..

// 同样 thunk 规范 一种异步操作规范 ..(它仅仅是一种规范) ..

// 目前,现在最理想的异步是 Promise

// 但是也可以使用 async - await 异步函数对  ...

let async = require("async")
let fs = require("fs")

var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
var configs = {};

function doSomethingWith(config) {
    console.log("finally result is " + JSON.stringify(config))
}

// 执行每一个,执行完毕再执行下一个 ..
async.forEachOf(obj, (value, key, callback) => {
    console.log(`invoke ${key}`)
    fs.readFile(__dirname + value, "utf8", (err, data) => {
        if (err) return callback(err);
        try {
            configs[key] = JSON.parse(data);
        } catch (e) {
            return callback(e);
        }

        // 虽然这里使用了timeout (但是callback 永远不会出错,所以没问题,即使它的堆栈是单独的) ...
        // 这里遵循 错误回调方式 ..
        setTimeout(() => {
            // 链式处理 ..
            callback();
        },2000)
    });
}, err => {
    if (err) console.error(err.message);
    // configs is now a map of JSON data
    doSomethingWith(configs);
});



// 由于node 底层通过 c++ 轮询 event loop,这样,我们提交的每一个event 都会在执行时 形成独立的调用栈 ...


