SHELL=/bin/bash

all: setup compile export-verifier

setup:
	zokrates setup

compile:
	zokrates compile -i sender.zok

export-verifier:
	rm -rf  verifier-*.sol
	zokrates export-verifier -o verifier-sender.sol
	sed -i '' 's/contract Verifier /contract VerifierSender /g' verifier-sender.sol

proof:
	zokrates generate-proof
