// 石头剪刀布

// 根据进程信息拿取 用户输入的信息 ..
let args = process.argv
if(args.length < 3) {
    console.log("please input you choose ,once again !!!");
}
else {
    let userAction = args[args.length - 1]
    let number = Math.random() * 3;
    let machineAction;
    let bits = [1,2,3]
    if(number < 1) {
        machineAction = "rock";
    }
    else if(number < 2) {
        machineAction = "cloth";
    }
    else {
        machineAction  = 'scissor';
    }

    if(machineAction === userAction) {
        console.log("平局 !")
    }
    else {
        console.log(`不一致,your choose ${userAction},machineAction ${machineAction}`)
    }
}