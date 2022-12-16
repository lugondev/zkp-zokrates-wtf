const { initialize } = require('zokrates-js')
const {
    readReceiverProvingKey,
    readReceiverZok,
    readSenderZok,
    readReceiverVerificationKey,
    readSenderProvingKey,
    readSenderVerificationKey,
} = require("./util")

const getComputationBalance = (balance) => initialize().then((zokratesProvider) => {
    const source = `import "hashes/sha256/512bitPacked" as sha256packed;
        def main(private field a, private field b,private field c, private field d) -> field[2] {
    return sha256packed([a, b, c, d]);
    }`;

    const artifacts = zokratesProvider.compile(source)
    const { witness } = zokratesProvider.computeWitness(artifacts, [ "0", "0", "0", `${balance}` ])
    const [ w1, w0 ] = witness.split("\n")
    const [ , w1Value ] = w1.split(" ")
    const [ , w0Value ] = w0.split(" ")
    return [ w0Value, w1Value ]
})

function getArtifactsSender(zokratesProvider) {
    const source = readSenderZok()
    return zokratesProvider.compile(source)
}

function getArtifactsReceiver(zokratesProvider) {
    const source = readReceiverZok()
    return zokratesProvider.compile(source)
}

function getProofReceiver(currentValue, updateValue, isDeposit = false) {
    // if (updateValue <= 0) {
    //     console.log("Invalid receiver's value")
    //     return Promise.resolve({})
    // }
    return initialize().then(async (zokratesProvider) => {
        const artifactsReceiver = getArtifactsReceiver(zokratesProvider)
        const [ computationCurrentValue, computationValueAfter ] = await Promise.all([ getComputationBalance(currentValue), getComputationBalance(currentValue + updateValue) ])
        const computeWitnessArgs = [ `${updateValue}`, `${currentValue}`, isDeposit ? `${updateValue}` : "0", currentValue == 0 ? "0" : `${computationCurrentValue[0]}`, computationValueAfter[0] ]
        const { witness } = zokratesProvider.computeWitness(artifactsReceiver, computeWitnessArgs);
        // generate proof
        const proof = zokratesProvider.generateProof(artifactsReceiver.program, witness, readReceiverProvingKey());
        // or verify off-chain
        const isVerified = zokratesProvider.verify(readReceiverVerificationKey(), proof);

        if (isVerified) {
            return {
                proof: proof.proof,
                inputs: proof.inputs,
                params: {
                    proof: JSON.stringify(Object.values(proof.proof)),
                    hashAfter: computationValueAfter[0],
                },
            }
        }
        return {}
    });
}

function getProofSender(currentValue, updateValue, isWithdraw = false) {
    // if (updateValue >= currentValue || updateValue <= 0) {
    //     console.log("Invalid sender's value")
    //     return Promise.resolve({})
    // }
    return initialize().then(async (zokratesProvider) => {
        const artifactsSender = getArtifactsSender(zokratesProvider)
        const [ computationCurrentValue, computationValueAfter ] = await Promise.all([ getComputationBalance(currentValue), getComputationBalance(currentValue - updateValue) ])
        const computeWitnessArgs = [ `${updateValue}`, `${currentValue}`, isWithdraw ? `${updateValue}` : "0", `${computationCurrentValue[0]}`, computationValueAfter[0] ]
        const { witness } = zokratesProvider.computeWitness(artifactsSender, computeWitnessArgs)
        // generate proof
        const proof = zokratesProvider.generateProof(artifactsSender.program, witness, readSenderProvingKey());
        // or verify off-chain
        const isVerified = zokratesProvider.verify(readSenderVerificationKey(), proof);

        if (isVerified) {
            return {
                proof: proof.proof,
                inputs: proof.inputs,
                params: {
                    proof: JSON.stringify(Object.values(proof.proof)),
                    hashAfter: computationValueAfter[0],
                },
            }
        }
        return {}
    });
}

module.exports = {
    getProofReceiver, getProofSender,
}
