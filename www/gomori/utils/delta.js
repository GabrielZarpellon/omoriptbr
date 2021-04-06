const { applyPatch } = require("../../JSON-Patch-3.0.0/index");
const YAML = require("../../js/libs/js-yaml-master/index");

function deltaPatchYml(patchData, currentData) {
    const patch = JSON.parse(patchData);
    const document = YAML.load(currentData);
    applyPatch(document, patch, true);
    return YAML.dump(document);
}

function deltaPatchJson(patchData, currentData) {
    const patch = JSON.parse(patchData);
    const document = JSON.parse(currentData);
    applyPatch(document, patch, true);
    return JSON.stringify(document);
}

module.exports = { deltaPatchYml, deltaPatchJson };
