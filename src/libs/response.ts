// 预定义的错误代码和默认消息
export const ERROR_CODES = {
    BAD_REQUEST: { code: 400, message: 'Invalid request' },
    UNAUTHORIZED: { code: 401, message: 'Unauthorized' },
    FORBIDDEN: { code: 403, message: 'Forbidden' },
    NOT_FOUND: { code: 404, message: 'Resource not found' },
    INTERNAL_ERROR: { code: 500, message: 'Internal server error' },
    TIMEOUT: { code: 504, message: 'Request timeout' },
    INVALID_ARGUMENT: { code: 1001, message: 'Invalid argument' },
    NETWORK_ERROR: { code: 1002, message: 'Network error' },
} as const;

// 响应类型
export type IPCResponse<T = any> =
    | {
        success: true;
        data: T;
    }
    | {
        success: false;
        code: number;
        message: string;
        details?: any;
    };

// 创建成功响应
export const successResponse = <T = any>(data?: T): IPCResponse<T> => ({
    success: true,
    data,
});

// 创建错误响应
export const errorResponse = (
    codeInfo: typeof ERROR_CODES[keyof typeof ERROR_CODES],
    details?: any,
    customMessage?: string
): IPCResponse => ({
    success: false,
    code: codeInfo.code,
    message: customMessage || codeInfo.message,
    details,
});
