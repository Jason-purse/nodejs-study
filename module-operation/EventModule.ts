const EventEmitter = require("events").EventEmitter
class Company extends EventEmitter {
    constructor() {
        super();
    }
}


let company = new Company()

// 监听事件 ..
let listener = (args) => {
    console.log(`args is ${JSON.stringify(args)}`)
};
company.addListener("one",listener)


company.emit("one",{value: "test",event: "one"})

setTimeout(() => {
    company.removeListener("one",listener)
},300)