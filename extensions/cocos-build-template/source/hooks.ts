import { BuildHook, IBuildResult } from '../@types';

const PACKAGE_NAME = 'cocos-build-template';

function log(...arg: any[]) {
    return console.log(`[${PACKAGE_NAME}] `, ...arg);
}

export const throwError: BuildHook.throwError = true;

export const load: BuildHook.load = async function () {
    console.log(`[${PACKAGE_NAME}] Load cocos plugin example in builder.`);

    const allAssets = await Editor.Message.request('asset-db', 'query-assets', { type: 'scene' });
};
export const unload: BuildHook.unload = async function () {
    console.log(`[${PACKAGE_NAME}] Load cocos plugin example in builder.`);
};

export const onBeforeBuild: BuildHook.onBeforeBuild = async function (options: any, result: IBuildResult) {
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
            log('Reading scene ', scene.url);
            const rootDir = dirname(scene.url);
            if (!allRootDirs.includes(rootDir)) allRootDirs.push(rootDir);

            const task = Editor.Message.request('asset-db', 'query-path', scene.uuid)
                .then(path => {
                    removeComponent(path, targetUuid);
                    return Editor.Message.request('asset-db', 'refresh-asset', scene.url);
                })
                .then(() => log(`=== Refresh URL ${scene.url} ===`))
                .catch(err => log(err));
            allTasks.push(task);
        })
        log('=== Checking all Prefabs ===');
        allRootDirs.forEach(rootDir => {
            Editor.Message.request('asset-db', 'query-assets', { ccType: 'cc.Prefab', pattern: `${rootDir}/**\/*` })
                .then(prefabs => {
                    prefabs.forEach(prefab => {
                        const task = Editor.Message.request('asset-db', 'query-path', prefab.uuid)
                            .then(path => {
                                removeComponent(path, targetUuid);
                                return Editor.Message.request('asset-db', 'refresh-asset', prefab.url);
                            })
                            .then(() => log(`=== Refresh URL ${prefab.url} ===`))
                            .catch(err => log(err));
                        allTasks.push(task);
                    })
                })
        })

        Promise.all(allTasks).then(results => {
            log('=== Finish build extension process ===');
        })
    }
};

// /*
function readScene(path) {
    const { readFileSync } = require('fs');
    const sceneString = readFileSync(path, { encoding: 'UTF-8' })
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
    })

    // if node have sprite comp => set spriteFrame null
    scriptedNodes.forEach(nodeInfo => {
        if (nodeInfo) {
            const { _components } = nodeInfo;
            if (_components) {
                _components.forEach(({ __id__ }) => {
                    if (sceneArr[__id__].__type__ == 'cc.Sprite') {
                        sceneArr[__id__]._spriteFrame = null;
                    }
                })
            }
        }
    })

    // overwrite scene file and refresh db
    writeFileSync(scenePath, JSON.stringify(sceneArr));
}
// */