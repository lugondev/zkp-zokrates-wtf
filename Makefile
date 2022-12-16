SHELL=/bin/bash

.PHONY: init compile receiver sender clean

init: clean receiver sender compile-sol

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
	npx hardhat compile

clean:
	rm -rf contracts/verifier-receiver.sol contracts/verifier-sender.sol
