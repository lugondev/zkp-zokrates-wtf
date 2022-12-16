const chai = require("chai")
const { expect } = require("chai")
const chaiAsPromised = require("chai-as-promised")
const { ethers } = require("hardhat")
const { getProofReceiver, getProofSender } = require("../scripts/zk")

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

        it('should deposit/withdraw and transfer', async function () {
            const [ user1, user2 ] = signers;
            let amountDeposit = ethers.utils.parseEther("10");
            // user must generate proof before deposit
            let proofToClaim = await getProofReceiver(0, ethers.utils.formatUnits(amountDeposit, "wei"), true)

            // deposit with proof generated
            await zkPrivacyPayment.deposit(proofToClaim.proofValues, proofToClaim.params.hashAfter, { value: amountDeposit });

            // checking
            expect(await ethers.provider.getBalance(zkPrivacyPayment.address)).to.equal(amountDeposit);
            expect(await zkPrivacyPayment.balanceHashes(user1.address)).to.equal(proofToClaim.params.hashAfter);

            // transfer balance to user2
            // this action requires both user1 and user2 to generate proof
            let amountWillSent = ethers.utils.parseEther("3");
            // user1 generate proof for sender
            let proofToSender = await getProofSender(ethers.utils.formatUnits(amountDeposit, "wei"), ethers.utils.formatUnits(amountWillSent, "wei"))
            // user2 generate proof for receiver: flag isDeposit only use for Deposit action
            let proofToReceiver = await getProofReceiver(0, ethers.utils.formatUnits(amountWillSent, "wei"))

            // transfer
            await zkPrivacyPayment.transferPrivacy(user2.address, proofToSender.proofValues, proofToSender.params.hashAfter, proofToReceiver.proofValues, proofToReceiver.params.hashAfter);

            // checking
            expect(await zkPrivacyPayment.balanceHashes(user1.address)).to.equal(proofToSender.params.hashAfter);
            expect(await zkPrivacyPayment.balanceHashes(user2.address)).to.equal(proofToReceiver.params.hashAfter);

            let amountWillWithdrawal = ethers.utils.parseEther("3");
            // withdraw. Note: need flag isWithdrawal = true to generate proof
            let proofToWithdrawal = await getProofSender(amountWillSent, ethers.utils.formatUnits(amountWillWithdrawal, "wei"), true)
            await zkPrivacyPayment.connect(user2).withdraw(amountWillWithdrawal, proofToWithdrawal.proofValues, proofToWithdrawal.params.hashAfter);

            // checking
            expect(await zkPrivacyPayment.balanceHashes(user2.address)).to.equal(proofToWithdrawal.params.hashAfter);
            expect(await ethers.provider.getBalance(zkPrivacyPayment.address)).to.equal(amountDeposit.sub(amountWillWithdrawal));
        });
    });
});
