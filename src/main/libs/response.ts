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
        error: null;
    }
    | {
        success: false;
        data: null;
        error: {
            code: number;
            message: string;
            details?: any;
        };
    };

// 创建成功响应
export const data = <T = any>(data?: T): IPCResponse<T> => ({
    success: true,
    data,
    error: null
});

// 创建错误响应
export const error = (
    codeInfo: typeof ERROR_CODES[keyof typeof ERROR_CODES],
    message?: string,
    details?: any
): IPCResponse => ({
    success: false,
    data: null,
    error: {
        code: codeInfo.code,
        message: message || codeInfo.message,
        details,
    }
});

export const IPCResponse = {
    data,
    error
};
