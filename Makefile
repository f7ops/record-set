
build: clean
	./node_modules/.bin/webpack

run: build
	node ./bundle.js

clean:
	rm -f bundle.js

test:
	ava -v

.PHONY: build clean run test
