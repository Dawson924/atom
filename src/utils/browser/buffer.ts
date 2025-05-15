function blobToBase64URL(blob: Blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        // 读取完成时触发
        reader.onloadend = () => {
            resolve(reader.result); // 返回 data:image/png;base64,...
        };

        // 读取错误时触发
        reader.onerror = reject;

        // 开始读取 Blob
        reader.readAsDataURL(blob);
    });
}

function blobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // 去掉 "data:image/png;base64," 前缀
            const base64Data = (reader.result as string).split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export { blobToBase64, blobToBase64URL };
