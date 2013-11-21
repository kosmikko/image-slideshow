STYL_BIN=node_modules/styl/bin/styl

BUILD_DIR = build

STYLES_SRC = $(shell find styles -name '*.styl')
STYLES = $(patsubst styles/%.styl, $(BUILD_DIR)/%.css, $(STYLES_SRC))

all: build-setup $(STYLES)

build-setup:
	@mkdir -p $(BUILD_DIR)

$(BUILD_DIR)/%.css: styles/%.styl
	@echo Creating $@ $<
	$(STYL_BIN) -w < $< > $@

watch:
	watch -i 1 $(MAKE) all

.PHONY: watch