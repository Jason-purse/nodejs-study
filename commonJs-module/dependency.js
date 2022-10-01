// 直接通过关键字 exports 进行向外暴露的输出,因为本身 exports 默认是一个 自变量对象 .. 但是我们也可以直接覆盖exports 为任何想要的形式 ...
exports.name = "dependency.js"
exports.request = function() {
    console.log("发送一个请求")
}