// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "./ERC20.sol";
import "./IVerifier.sol";

contract ZkPrivacyPayment is ERC20 {
    mapping(address => uint256) public balanceHashes;

    IVerifier public verifierReceiver;
    IVerifier public verifierSender;

    constructor(address _receiver, address _sender)
    ERC20("ZK Privacy Payment", "ZKP")
    {
        require(
            _receiver != address(0),
            "ZkPrivacyPayment: receiver is the zero address"
        );
        require(
            _sender != address(0),
            "ZkPrivacyPayment: sender is the zero address"
        );
        verifierReceiver = IVerifier(_receiver);
        verifierSender = IVerifier(_sender);
    }

    receive() external payable {}

    function deposit(IVerifier.Proof memory proofDeposit, uint256 hashBalanceAfter) public payable {
        _totalSupply += msg.value;
        claim(msg.value, proofDeposit, hashBalanceAfter);
    }

    function claim(uint256 amount, IVerifier.Proof memory proofClaim, uint256 hashBalanceAfter)
    internal
    {
        require(amount > 0, "No deposit");

        uint256 hashBalanceBefore = balanceHashes[msg.sender];
        uint256[4] memory inputClaim = [
        amount,
        hashBalanceBefore,
        hashBalanceAfter,
        1
        ];

        bool claimProofIsCorrect = verifierReceiver.verifyTx(
            proofClaim,
            inputClaim
        );
        require(claimProofIsCorrect, "Claimer's proof is not correct");

        balanceHashes[msg.sender] = hashBalanceAfter;
    }

    function mint(
        address _to,
        IVerifier.Proof memory proofReceiver,
        uint256 hashReceiverBalanceAfter
    ) public onlyOwner {
        uint256 hashReceiverBalanceBefore = balanceHashes[_to];
        uint256[4] memory inputReceiver = [
        0,
        hashReceiverBalanceBefore,
        hashReceiverBalanceAfter,
        1
        ];

        bool receiverProofIsCorrect = verifierReceiver.verifyTx(
            proofReceiver,
            inputReceiver
        );
        require(receiverProofIsCorrect, "Receiver's proof is not correct");
        balanceHashes[_to] = hashReceiverBalanceAfter;
    }

    function withdraw(
        uint256 _amount,
        IVerifier.Proof memory proofWithdrawal,
        uint256 hashBalanceAfter
    ) public {
        uint256 hashBalance = balanceHashes[msg.sender];
        uint256[4] memory input = [_amount, hashBalance, hashBalanceAfter, 1];
        bool senderProofIsCorrect = verifierSender.verifyTx(
            proofWithdrawal,
            input
        );

        require(senderProofIsCorrect, "Sender's proof is not correct");

        _totalSupply -= _amount;
        payable(msg.sender).transfer(_amount);
        balanceHashes[msg.sender] = hashBalanceAfter;
    }

    function transferPrivacy(
        address _to,
        IVerifier.Proof memory proofSender,
        uint256 hashSenderBalanceAfter,
        IVerifier.Proof memory proofReceiver,
        uint256 hashReceiverBalanceAfter
    ) public {
        uint256 hashSenderBalanceBefore = balanceHashes[msg.sender];
        uint256 hashReceiverBalanceBefore = balanceHashes[_to];

        uint256[4] memory inputSender = [
        0,
        hashSenderBalanceBefore,
        hashSenderBalanceAfter,
        1
        ];
        uint256[4] memory inputReceiver = [
        0,
        hashReceiverBalanceBefore,
        hashReceiverBalanceAfter,
        1
        ];

        bool senderProofIsCorrect = verifierSender.verifyTx(
            proofSender,
            inputSender
        );
        bool receiverProofIsCorrect = verifierReceiver.verifyTx(
            proofReceiver,
            inputReceiver
        );

        require(senderProofIsCorrect, "Sender's proofs are not correct");
        require(receiverProofIsCorrect, "Receiver's proofs are not correct");

        balanceHashes[msg.sender] = hashSenderBalanceAfter;
        balanceHashes[_to] = hashReceiverBalanceAfter;
    }
}
