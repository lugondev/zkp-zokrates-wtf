SHELL=/bin/bash

all: setup compile export-verifier

setup:
	zokrates setup

compile:
	zokrates compile -i receiver.zok

export-verifier:
	rm -rf  verifier-*.sol
	zokrates export-verifier -o verifier-receiver.sol
	sed -i '' 's/contract Verifier /contract VerifierReceiver /g' verifier-receiver.sol

proof:
	zokrates generate-proof
