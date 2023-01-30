"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onBeforeBuild = exports.unload = exports.load = exports.throwError = void 0;
const PACKAGE_NAME = 'cocos-build-template';
function log(...arg) {
    return console.log(`[${PACKAGE_NAME}] `, ...arg);
}
exports.throwError = true;
const load = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] Load cocos plugin example in builder.`);
        const allAssets = yield Editor.Message.request('asset-db', 'query-assets', { type: 'scene' });
    });
};
exports.load = load;
const unload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`[${PACKAGE_NAME}] Load cocos plugin example in builder.`);
    });
};
exports.unload = unload;
const onBeforeBuild = function (options, result) {
    return __awaiter(this, void 0, void 0, function* () {
        const { localize, targetComponent } = options.packages[PACKAGE_NAME];
        const { scenes } = options;
        const targetUuid = Editor.Utils.UUID.compressUUID(targetComponent, null);
        const { dirname } = Editor.Utils.Path;
        if (localize) {
            // const allAssets = await Editor.Message.request('asset-db', 'query-assets', { type: 'scene' });
            let allTasks = [];
            let allRootDirs = [];
            log('=== Checking all Scenes ===');
            scenes.forEach(scene => {
                log('=== Reading scene ', scene.url, ' ===');
                const rootDir = dirname(scene.url);
                if (!allRootDirs.includes(rootDir))
                    allRootDirs.push(rootDir);
                const task = Editor.Message.request('asset-db', 'query-path', scene.uuid)
                    .then(path => {
                    removeComponent(path, targetUuid);
                    return Editor.Message.request('asset-db', 'refresh-asset', scene.url);
                })
                    .then(() => log(`=== Refresh URL ${scene.url} ===`))
                    .catch(err => log(err));
                allTasks.push(task);
            });
            log('=== Checking all Prefabs ===');
            let prefabTasks = [];
            allRootDirs.forEach(rootDir => {
                const prefabTask = Editor.Message.request('asset-db', 'query-assets', { ccType: 'cc.Prefab', pattern: `${rootDir}/**\/*` })
                    .then(prefabs => {
                    prefabs.forEach(prefab => {
                        log('=== Reading prefab ', prefab.url, ' ===');
                        const task = Editor.Message.request('asset-db', 'query-path', prefab.uuid)
                            .then(path => {
                            removeComponent(path, targetUuid);
                            return Editor.Message.request('asset-db', 'refresh-asset', prefab.url);
                        })
                            .then(() => log(`=== Refresh URL ${prefab.url} ===`))
                            .catch(err => log(err));
                        allTasks.push(task);
                    });
                })
                    .catch(err => log(err));
                prefabTasks.push(prefabTask);
            });
            Promise.all(prefabTasks).then(() => {
                log(`=== Build Extension with ${allTasks.length} tasks ===`);
                Promise.all(allTasks).then(results => {
                    log('=== Finish build extension process ===');
                });
            });
        }
        ;
    });
};
exports.onBeforeBuild = onBeforeBuild;
// /*
function readScene(path) {
    const { readFileSync } = require('fs');
    const sceneString = readFileSync(path, { encoding: 'UTF-8' });
    return JSON.parse(sceneString);
}
function removeComponent(scenePath, targetUuid) {
    let sceneArr = readScene(scenePath);
    const { writeFileSync } = require('fs');
    // get all nodes having this script
    const scriptedNodes = [];
    sceneArr.forEach(sceneInfo => {
        if (sceneInfo.__type__ == targetUuid) {
            scriptedNodes.push(sceneArr[sceneInfo.node.__id__]);
        }
    });
    // if node have sprite comp => set spriteFrame null
    scriptedNodes.forEach(nodeInfo => {
        if (nodeInfo) {
            const { _components } = nodeInfo;
            if (_components) {
                _components.forEach(({ __id__ }) => {
                    if (sceneArr[__id__].__type__ == 'cc.Sprite') {
                        sceneArr[__id__]._spriteFrame = null;
                    }
                });
            }
        }
    });
    // overwrite scene file and refresh db
    writeFileSync(scenePath, JSON.stringify(sceneArr));
}
// */
