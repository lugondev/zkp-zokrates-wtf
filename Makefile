SHELL=/bin/bash

.PHONY: init compile receiver sender

init: receiver sender

receiver:
	cd receiver && make

sender:
	cd sender && make

compile-zok:
	cd receiver && make compile
	cd sender && make compile

compile-sol:
	cp receiver/verifier-receiver.sol contracts/verifier-receiver.sol
	cp sender/verifier-sender.sol contracts/verifier-sender.sol
	cd contracts && sed -i '' 's/contract Verifier /contract VerifierSender /g' verifier-sender.sol
	cd contracts && sed -i '' 's/contract Verifier /contract VerifierReceiver /g' verifier-receiver.sol
	npx hardhat compile
