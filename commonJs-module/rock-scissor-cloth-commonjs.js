/**
 * 采用 commonjs 规范 导出 游戏依赖 ..
 *
 * userAction : rock,machineAction: 1
 * you wined !!!
 * rock
 * userAction : rock,machineAction: 1
 * you wined !!!
 * cloth
 * userAction : cloth,machineAction: 2
 * you wined !!!
 * your continue win 3 order, so i exit !!
 * game over !!!
 *
 *
 * 效果就是能够在3次之后,结束进程,并打印 game over ....
 *
 * 或者通过 bye 进行 game over ....
 */

// scissor / rock / cloth
let bits = {"scissor": 1, "rock": 2, "cloth": 3}
let chooseAction = function (number) {
    return Object.keys(bits)[number - 1]
}

let exit = function () {
    process.exit(0)
}


let play = function(args = process.argv) {
    if (args.length < 3) {
        console.log("you need pass a parameter,please once again")
    } else {
        let userAction = args[2]
        let machineAction = Math.ceil(Math.random() * 3)
        console.log(`userAction : ${userAction},machineAction: ${machineAction}`)
        let userBit = bits[userAction]
        let machineBit = bits[chooseAction(machineAction)]

        let status = -1;
        // 只需要判断用户的极端状态
        if (userBit === 1 && machineBit === 3) {
            status = true;
        } else if (userBit === 3 && machineBit === 1) {
            status = false;
        } else {
            // 直接相减
            if (userBit - machineBit > 0) {
                status = true;
            } else if (userBit - machineBit === 0) {
                // pass
            } else {
                status = false;
            }
        }

        if(status === -1) {
            console.log("平局 !!!")
        }
        else if(status) {
            console.log("you wined !!!")
        }
        else {
            console.log("you lossed !!!")
        }

        return status;
    }
}

let listener = null;

module.exports = {
    chooseAction,
    play,
    smartPlay(func = play,count = 3) {
        let tempCount = 0;
        // 我们需要改变 ...
        let args =[... process.argv]
        if(listener == null) {
            listener = el => {
                args[2] = el.toString().trim();
                if(args[2] === 'bye') {
                    // 去除监听 ...
                    process.stdin.off('data',listener)
                    // play ...
                    console.log("game over !!!")

                    exit()
                    return
                }
                // func ...
                let result = func(args)
                if(result === -1 || !result) {
                    // -1
                    tempCount = 0;
                }
                else {
                    // 执行了一次 ...
                    tempCount ++;
                    if(tempCount >= 3) {
                        console.log("your continue win 3 order, so i exit !!")
                        process.stdin.off('data',listener)
                        // play ...
                        console.log("game over !!!")
                        exit(0)
                    }
                }
            }
            // 加上监听 ...
            process.stdin.on('data',listener)
        }else {
            // 仅仅能够启动一个监听器
            console.log("startPlay was begin,so input bye destroy and play once again !!!")
        }
    }

}