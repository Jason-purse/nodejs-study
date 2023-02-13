/**
 * 完全版的 模板引擎
 */
let vm = require("vm")
let fs = require("fs")

// 模板缓存 ..
const templateCache = new Map()

const templateForDataCache = new Map()

/**
 * 创建模板 ...
 * @param templateFile 模板文件路径 ...
 */
const createTemplate = function (templateFile) {

    if(!templateCache.has(templateFile)) {
        // 优化,将 readFileSync 的内容直接buffer 输出,而不是转成字符串 ... 提升效率
        templateCache.set(templateFile, function (data) {
            let cacheMap;
            let key = JSON.stringify(data);
            if (templateForDataCache.has(templateFile)) {
                 cacheMap = templateForDataCache.get(templateFile)
                if(cacheMap.has(key)) {
                    return cacheMap.get(key)
                }
            }
            else {
                cacheMap = new Map();
                templateForDataCache.set(templateFile,cacheMap);
            }

            // 根据data 进行优化
            let value = vm.runInNewContext(`(function (data) {
            with (data) {
                return \`${fs.readFileSync(templateFile)}\`
            }
        })`, {
                include(templateName) {
                    return (templateCache[templateName] || createTemplate(templateName))(data)
                }
            })(data);

            cacheMap.set(key,value);

            return value;
        })

    }



    return templateCache.get(templateFile);
}


const exported = function (templateFile: string) {
    return function (data) {
        return createTemplate(templateFile)(data);
    }
}

module.exports = exported;

