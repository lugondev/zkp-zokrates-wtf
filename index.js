const { getProofReceiver, getProofSender } = require("./scripts/zk")
const { ethers } = require("hardhat")

// Promise.all([
//     getProofReceiver(0,60000000000000000),
//     getProofSender(100000000000000000,60000000000000000)
// ]).then(([proofReceiver, proofSender]) => {
//     console.log({
//         sender: proofSender.params,
//         receiver: proofReceiver.params,
//     })
// })
//
// getProofSender(60000000000000000, 50000000000000000, true)
//     .then(proofWithdrawal => {
//         console.log(proofWithdrawal.params)
//     })

let amountDeposit = ethers.utils.parseEther("1");
let updateValue = ethers.utils.formatUnits(amountDeposit, "wei") // 1000000000000000000
console.log({ updateValue })
getProofReceiver(0, "1000000000000000000")
    .then(proofClaim => {
        console.log(proofClaim.params)
        console.log(JSON.stringify(proofClaim.inputs))
    })
