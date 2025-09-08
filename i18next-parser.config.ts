export default {
    contextSeparator: '_',
    createOldCatalogs: false,
    defaultNamespace: 'translation',
    defaultValue: () => {
        return '';
    },
    indentation: 4,
    keepRemoved: false,
    keySeparator: false,
    locales: ['en', 'zh-cn', 'zh-tw'],
    namespaceSeparator: false,
    output: './public/locales/$LOCALE/$NAMESPACE.json',
    input: [
        './src/renderer/**/*.{js,jsx,ts,tsx}'
    ],
    sort: true
};
