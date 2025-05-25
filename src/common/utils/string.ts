type CharType = 'letter' | 'cjk' | undefined;

function withUpperCase(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function isLetter(str: string): boolean {
    return /^[a-zA-Z]$/.test(str);
}

function isCJK(str: string): boolean {
    return /^[\u4E00-\u9FFF\u3000-\u303F\u30A0-\u30FF\u31F0-\u31FF]$/.test(str);
}

function checkFirstCharType(str: string): CharType {
    if (str.length === 0) {
        return undefined;
    }

    const firstChar = str.charAt(0);

    if (isLetter(firstChar)) {
        return 'letter';
    } else if (isCJK(firstChar)) {
        return 'cjk';
    } else {
        return undefined;
    }
}

function hasSpace(str: string): boolean {
    return /\s/.test(str);
}

function extractInitials(str: string): string | undefined {
    if (hasSpace(str)) {
        const parts: string[] = str.split(' ');
        if (checkFirstCharType(parts[0]) === 'letter' && checkFirstCharType(parts[1]) === 'letter') {
            const first = str.charAt(0).toUpperCase();
            const second = str.charAt(1).toUpperCase();
            return first + second;
        } else if (checkFirstCharType(parts[0]) === 'letter' && checkFirstCharType(parts[1]) !== 'letter') {
            return str.charAt(0).toUpperCase();
        } else if (checkFirstCharType(parts[0]) === 'cjk') {
            return str.charAt(0).toUpperCase();
        }
        return void 0;
    } else {
        return str.charAt(0).toUpperCase();
    }
}

function truncateWithEllipsis(str: string, maxLength: number, ellipsis = '...'): string {
    if (!str || str.length <= maxLength) {
        return str;
    }
    return str.slice(0, maxLength) + ellipsis;
}

function maskPassword(str: string, maxLength: number): string {
    if (!str || str.length >= maxLength) return '•'.repeat(maxLength);
    else return '•'.repeat(str.length);
}

function getExtension(str: string): string | undefined {
    const parts = str.split('.');
    if (parts.length > 1) {
        return parts.pop()!;
    }
    return void 0;
}

function padStrings(str1: string, str2: string) {
    // 获取两个字符串的长度
    const len1 = str1.length;
    const len2 = str2.length;

    const maxLength = Math.max(len1, len2);

    if (len1 < maxLength) {
        str1 = str1.padEnd(maxLength);
    }
    if (len2 < maxLength) {
        str2 = str2.padEnd(maxLength);
    }

    return [str1, str2];
}

export type { CharType };

export {
    withUpperCase,
    isLetter,
    isCJK,
    checkFirstCharType,
    hasSpace,
    extractInitials,
    truncateWithEllipsis,
    maskPassword,
    getExtension,
    padStrings,
};
