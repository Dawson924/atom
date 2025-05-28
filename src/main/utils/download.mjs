import fs from 'fs';
import { request } from 'undici';
import { pipeline } from 'stream/promises';

/**
 * Download file from remote url
 * @param {string} url
 * @param {string} outputPath
 * @param {{ onProgress: (state) => void, resume: boolean }} options
 * @returns {Promise<void>}
 */
export async function downloadFile(url, outputPath, options = {}) {
    const { onProgress = () => { }, resume = false } = options;
    let fileSize;
    let downloadedSize = 0;
    let headers = {};

    // 检查文件是否存在，获取已下载的大小以支持断点续传
    if (resume && fs.existsSync(outputPath)) {
        const stats = fs.statSync(outputPath);
        downloadedSize = stats.size;
        headers = { Range: `bytes=${downloadedSize}-` };
    }

    try {
        // 发起请求
        const response = await request(url, { headers });

        if (response.statusCode === 416) {
            console.log('文件已完全下载');
            return;
        }

        if (response.statusCode !== 200 && response.statusCode !== 206) {
            throw new Error(`下载失败，状态码: ${response.statusCode}`);
        }

        // 获取文件总大小
        fileSize = parseInt(response.headers['content-length'], 10);
        if (!fileSize) {
            throw new Error('无法获取文件大小');
        }

        // 计算实际需要下载的总大小（考虑断点续传）
        const totalSize = downloadedSize + fileSize;

        // 创建可写流
        const fileStream = fs.createWriteStream(outputPath, { flags: resume ? 'a' : 'w' });

        // 处理数据接收进度
        response.body.on('data', (chunk) => {
            downloadedSize += chunk.length;
            onProgress({
                downloaded: downloadedSize,
                total: totalSize,
                percentage: Math.round((downloadedSize / totalSize) * 100),
            });
        });

        // 使用 pipeline 处理流
        await pipeline(response.body, fileStream);

        console.log(`文件下载完成，保存至: ${outputPath}`);
        return outputPath;
    } catch (error) {
        console.error('下载过程中发生错误:', error.message);
        throw error;
    }
}
