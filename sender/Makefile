SHELL=/bin/bash

all: setup compile export-verifier

setup:
	zokrates setup

compile:
	zokrates compile -i sender.zok

export-verifier:
	zokrates export-verifier -o verifier-sender.sol

proof:
	zokrates generate-proof
