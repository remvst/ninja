.PHONY: build

build:
	node build.js

update: install
	cd js13k-compiler && git checkout master && git pull && npm install && rm package-lock.json

install:
	git submodule init
	git submodule update
	brew install node advancecomp
	cd js13k-compiler && git checkout master && git pull && npm install && rm package-lock.json
