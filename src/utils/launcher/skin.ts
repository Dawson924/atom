import { Jimp } from 'jimp';

// const getFaceSkinFromBase64 = async (skin: string) => {
//     const buffer = Buffer.from(skin, 'base64');
//     const sharpSkin = sharp(buffer);
//     const sharpHead = sharpSkin.extract({ left: 8, top: 8, width: 8, height: 8 });
//     try {
//         const data = await sharpHead
//             .toBuffer();
//         return data.toString('base64');
//     } catch (error) {
//         throw new Error(
//             "Couldn't extract head of skin" + '. Reason: ' + error
//         );
//     }
// };

const getFaceSkinFromBase64 = async (skin: string) => {
    try {
    // 从 Base64 解码 Buffer
        const buffer = Buffer.from(skin, 'base64');

        // 使用 Jimp 读取图像
        const image = await Jimp.read(buffer);

        // 裁剪图像区域 (x, y, width, height)
        image.crop({
            x: 8, y: 8,
            w: 8,
            h: 8
        });

        // 获取处理后的图像 Buffer 并转为 Base64
        const processedBuffer = await image.getBuffer('image/png');
        return processedBuffer.toString('base64');
    } catch (error) {
        throw new Error("Couldn't extract head of skin. Reason: " + error);
    }
};

export {
    getFaceSkinFromBase64
};
