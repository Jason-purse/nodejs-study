// 异步函数对

// asyc / await
// 虽然它能够它可以进行通过await 进行同步方式的形式写异步 ..
// 但是
// await ..
// await ..
// await ..
// 这种就变成了完全同步的方式,这就没有利用到异步优势  .
// 所以可以使用
// Promise.all() 进行等待所有异步任务结束 ... (达到最优解决方案, 使用最少的时间做最多的事情) ..

async function Top() {
    return 1234;
}

async function Bottom() {
    return 2345;
}


(function() {

    Top().then(resolve => {
        console.log(`resolve result ${resolve}`)
    },reject => {
        console.log(`reject result ${reject}`)
    }).catch(error => {
        console.log(error)
    }).finally(() => {
        Bottom().finally(() => {
            console.log(`bottom process result ...`)
        })
    })


})()



new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("4")
    },500)
}).catch(reason => {
    console.log(`reason ${reason}`)
})

new Promise(((resolve, reject) => {
    setTimeout(() => {
        reject("5")
    },500)
})).then(null,reject => {
    console.log(`reject ${reject}`)
}).catch(reason => {
    console.log(`reason ${reason}`)
})


