SHELL:=/bin/bash
DOCKER_ACCOUNT?=uscictdocker
DOCKER_IMAGE?=uscictdocker/react-cmi5-context

node_modules/prettier:
	npm install

.PHONY: format
format: node_modules/prettier
	npm run format

.PHONY: format
test-format: node_modules/prettier
	npm run test:format

LICENSE:
	@echo "you must have a LICENSE file" 1>&2
	exit 1

.PHONY: license
license: LICENSE node_modules/license-check-and-add
	npm run license:fix

.PHONY: test-license
test-license: LICENSE node_modules/license-check-and-add
	npm run test:license

node_modules/license-check-and-add:
	npm ci