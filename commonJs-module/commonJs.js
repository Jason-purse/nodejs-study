/**
 * common js 规范
 * 通过exports 关键字暴露向外提供服务的信息 ..
 * 但是如果直接覆盖exports,那么相当于将整个exports (向外暴露的对象 覆盖为一个普通数据类型 / 函数,任何你想要的形式) ...
 */


// 这里我们将假设包含一个依赖的其他模块
console.log("require before")
let dependency = require("./dependency.js")
console.log("require after")


// 发送一个请求 ..
dependency.request()


let dependency1 = require("./dependency1.js")
// 这里的导出直接作为了函数 ...
console.log(dependency1 instanceof Function)