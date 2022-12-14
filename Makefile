SHELL=/bin/bash

.PHONY: init compile receiver sender

init: receiver sender

receiver:
	cd receiver && make

sender:
	cd sender && make

compile:
	cd receiver && make compile
	cd sender && make compile
