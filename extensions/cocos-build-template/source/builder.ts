
import { BuildPlugin } from '../@types';

export const load: BuildPlugin.load = function () {
    console.debug('cocos-build-template load');

};

export const unload: BuildPlugin.load = function () {
    console.debug('cocos-build-template unload');
};

export const configs: BuildPlugin.Configs = {
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

export const assetHandlers: BuildPlugin.AssetHandlers = './asset-handlers';
