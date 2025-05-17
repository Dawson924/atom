import type { SetTextureOption, YggdrasilTexture, YggdrasilTexturesInfo } from '@xmcl/user';

const DEFAULT_SKIN_URL = 'htts://www.xxxyyy.zzz';

const getTexturesInfo = async (uuid: string): Promise<YggdrasilTexturesInfo> => {
    return new Promise((ok) => {
        window.auth.lookup(uuid).then(async (profile) => {
            const textureInfo: YggdrasilTexturesInfo = JSON.parse(atob(profile.properties.textures));
            ok(textureInfo);
        });
    });
};

const getTextures = async (uuid: string): Promise<YggdrasilTexturesInfo['textures']> => {
    const texturesInfo = await getTexturesInfo(uuid);
    return texturesInfo.textures;
};

const getSkinData = async (uuid: string): Promise<YggdrasilTexture> => {
    const textures = await getTextures(uuid);
    if (!textures.SKIN) {
        return {
            url: DEFAULT_SKIN_URL,
            metadata: {
                model: 'steve',
                isDefault: true,
            }
        };
    }
    else {
        return textures.SKIN;
    }
};

const setTexture = async (option: SetTextureOption) => {
    await window.auth.setTexture(option);
};

export {
    getTexturesInfo,
    getTextures,
    getSkinData,
    setTexture,
};
