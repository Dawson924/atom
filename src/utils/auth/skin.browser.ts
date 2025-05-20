import type { SetTextureOption, YggdrasilTexture, YggdrasilTexturesInfo } from '@xmcl/user';

const DEFAULT_SKIN_URL = 'htts://www.xxxyyy.zzz';

const getTexturesInfo = (uuid: string): Promise<YggdrasilTexturesInfo> => {
    return new Promise((ok, no) => {
        window.auth.lookup(uuid)
            .then(profile => {
                const textureInfo: YggdrasilTexturesInfo = JSON.parse(atob(profile.properties.textures));
                ok(textureInfo);
            })
            .catch(_ => no(_));
    });
};

const getTextures = (uuid: string): Promise<YggdrasilTexturesInfo['textures']> => {
    return new Promise((ok, no) => {
        getTexturesInfo(uuid)
            .then(texturesInfo => ok(texturesInfo.textures))
            .catch(_ => no(_));
    });
};

const getSkinData = (uuid: string): Promise<YggdrasilTexture> => {
    return new Promise((ok, no) => {
        getTextures(uuid)
            .then(textures => {
                if (!textures.SKIN) {
                    ok({
                        url: DEFAULT_SKIN_URL,
                        metadata: {
                            model: 'steve',
                            isDefault: true,
                        }
                    });
                }
                else {
                    ok(textures.SKIN);
                }
            })
            .catch(_ => no(_));
    });
};

const setTexture = async (option: SetTextureOption) => {
    return await window.auth.setTexture(option);
};

export {
    getTexturesInfo,
    getTextures,
    getSkinData,
    setTexture,
};
