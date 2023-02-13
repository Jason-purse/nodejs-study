/**
 * 通过 vm 模块实现模板引擎的功能(通过执行es 6 模板字符串语法) ..
 *
 * 本质上就是重新编译 字符串并执行 ...
 * (可以传递上下文) ...
 */
let vm = require("vm")

let templateEngine = function (templateMap) {

    let engine = {
        include(templateName) {
            return engine.asText(templateMap[templateName])
        },
        xss(markup) {
            if (!markup) {
                return ''
            }

            return String(markup).replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/'/g, "&#39;")
                .replace(/"/g, "&quot;");
        },
        asText(text) {
            return vm.runInNewContext(text, engine)
        }
    };


    return engine;
}

module.exports = templateEngine