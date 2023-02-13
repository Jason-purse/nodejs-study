let env = process.env
for (let envKey in env) {
    console.log(`key: ${envKey} ,value: ${env[envKey]}`)
}

console.log("current dir name " + __dirname)
console.log("current file name " + __filename)