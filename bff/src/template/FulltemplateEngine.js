/**
 * 完全版的 模板引擎
 */
var vm = require("vm");
var fs = require("fs");
// 模板缓存 ..
var templateCache = new Map();
var templateForDataCache = new Map();
/**
 * 创建模板 ...
 * @param templateFile 模板文件路径 ...
 */
var createTemplate = function (templateFile) {
    if (!templateCache.has(templateFile)) {
        // 优化,将 readFileSync 的内容直接buffer 输出,而不是转成字符串 ... 提升效率
        templateCache.set(templateFile, function (data) {
            var cacheMap;
            var key = JSON.stringify(data);
            if (templateForDataCache.has(templateFile)) {
                cacheMap = templateForDataCache.get(templateFile);
                if (cacheMap.has(key)) {
                    return cacheMap.get(key);
                }
            }
            else {
                cacheMap = new Map();
                templateForDataCache.set(templateFile, cacheMap);
            }
            // 根据data 进行优化
            var value = vm.runInNewContext("(function (data) {\n            with (data) {\n                return `".concat(fs.readFileSync(templateFile), "`\n            }\n        })"), {
                include: function (templateName) {
                    return (templateCache[templateName] || createTemplate(templateName))(data);
                }
            })(data);
            cacheMap.set(key, value);
            return value;
        });
    }
    return templateCache.get(templateFile);
};
var exported = function (templateFile) {
    return function (data) {
        return createTemplate(templateFile)(data);
    };
};
module.exports = exported;
