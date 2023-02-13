let client = require("./src/client/client.ts")

client.write({
    columnid: 192
},(error,result) => {
    if(error) {
        console.log(`error is ${error}`)
    }
    else {
        console.log(result)
    }
})