STYL_BIN=node_modules/styl/bin/styl
BROWSERIFY_BIN=node_modules/.bin/browserify

BUILD_DIR = build

STYLES_SRC = $(shell find styles -name '*.styl')
STYLES = $(patsubst styles/%.styl, $(BUILD_DIR)/%.css, $(STYLES_SRC))

JS_SRC = $(shell find js -name '*.js')
JS = $(patsubst js/%.js, $(BUILD_DIR)/%.js, $(JS_SRC))

COMPONENTS = components/necolas-normalize.css/normalize.css

all: build-setup 3rdparty $(STYLES) $(JS)

build-setup:
	@mkdir -p $(BUILD_DIR)

# copy components
3rdparty: ${COMPONENTS}
	@cp components/necolas-normalize.css/normalize.css $(BUILD_DIR)/normalize.css

$(BUILD_DIR)/%.css: styles/%.styl
	@echo Creating $@ $<
	$(STYL_BIN) -w < $< > $@

$(BUILD_DIR)/%.js: js/%.js
	@echo Creating $@ $<
	$(BROWSERIFY_BIN) $< --outfile $@

watch:
	watch -i 1 $(MAKE) all

.PHONY: watch

