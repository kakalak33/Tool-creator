"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetHandlers = exports.configs = exports.unload = exports.load = void 0;
const load = function () {
    console.debug('cocos-build-template load');
};
exports.load = load;
const unload = function () {
    console.debug('cocos-build-template unload');
};
exports.unload = unload;
exports.configs = {
    '*': {
        hooks: './hooks',
        doc: 'editor/publish/custom-build-plugin.html',
        options: {
            localize: {
                label: 'Localize build',
                default: false,
                render: {
                    ui: 'ui-checkbox',
                }
            },
            targetComponent: {
                label: 'Target component',
                default: null,
                render: {
                    ui: 'ui-asset',
                    attributes: {
                        droppable: 'cc.Script',
                        placeholder: 'cc.Script',
                    }
                }
            },
        },
        verifyRuleMap: {
            ruleTest: {
                message: 'i18n:cocos-build-template.ruleTest_msg',
                func(val, buildOptions) {
                    if (val === 'cocos') {
                        return true;
                    }
                    return false;
                },
            },
        },
    },
};
exports.assetHandlers = './asset-handlers';
