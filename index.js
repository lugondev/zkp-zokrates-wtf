const { getProofReceiver, getProofSender } = require("./scripts/zk")

Promise.all([
    getProofReceiver(0,60000000000000000),
    getProofSender(100000000000000000,60000000000000000)
]).then(([proofReceiver, proofSender]) => {
    console.log({
        sender: proofSender.params,
        receiver: proofReceiver.params,
    })
})

getProofSender(60000000000000000, 50000000000000000, true)
    .then(proofWithdrawal => {
        console.log(proofWithdrawal.params)
    })
