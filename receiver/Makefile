SHELL=/bin/bash

all: setup compile export-verifier

setup:
	zokrates setup

compile:
	zokrates compile -i receiver.zok

export-verifier:
	rm -rf  verifier-*.sol
	zokrates export-verifier -o verifier-receiver.sol

proof:
	zokrates generate-proof
