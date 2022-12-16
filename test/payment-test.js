const chai = require("chai")
const { expect } = require("chai")
const chaiAsPromised = require("chai-as-promised")
const { ethers } = require("hardhat")
const { getProofReceiver } = require("../scripts/zk")

chai.use(chaiAsPromised)

describe("ZkPrivacyPayment", () => {
    let signers
    let zkPrivacyPayment, verifierSender, verifierReceiver

    beforeEach(async () => {
        signers = await ethers.getSigners();

        const ZkPrivacyPayment = await ethers.getContractFactory("ZkPrivacyPayment");
        const VerifierSender = await ethers.getContractFactory("VerifierSender");
        const VerifierReceiver = await ethers.getContractFactory("VerifierReceiver");

        verifierSender = await VerifierSender.deploy();
        await verifierSender.deployed();
        verifierReceiver = await VerifierReceiver.deploy();
        await verifierReceiver.deployed();

        zkPrivacyPayment = await ZkPrivacyPayment.deploy(verifierReceiver.address, verifierSender.address);
        await zkPrivacyPayment.deployed();
    });

    describe("ZK privacy transaction payments", function () {
        it("deployed contract", async function () {
            expect(await zkPrivacyPayment.name()).to.equal("ZK Privacy Payment");
            expect(await zkPrivacyPayment.symbol()).to.equal("ZKP");

            expect(await zkPrivacyPayment.verifierSender()).to.equal(verifierSender.address);
            expect(await zkPrivacyPayment.verifierReceiver()).to.equal(verifierReceiver.address);
        });

        it('should deposit and claim', async function () {
            const [ user1 ] = signers;
            let amountDeposit = ethers.utils.parseEther("1");
            await zkPrivacyPayment.deposit({ value: amountDeposit });
            expect(await zkPrivacyPayment.deposits(user1.address)).to.equal(amountDeposit);

            let proofToClaim = await getProofReceiver(0, ethers.utils.formatUnits(amountDeposit, "wei"), true)

            let hashAfterClaim = proofToClaim.params.hashAfter
            await zkPrivacyPayment.claim(proofToClaim.proof, hashAfterClaim);

            expect(await zkPrivacyPayment.deposits(user1.address)).to.equal(0);
            expect(await zkPrivacyPayment.balanceHashes(user1.address)).to.equal(hashAfterClaim);
        });
    });
});
