
build: clean
	./node_modules/.bin/webpack

run: build
	node ./bundle.js

clean:
	rm bundle.js

.PHONY: build
