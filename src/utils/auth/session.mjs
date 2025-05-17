const requestSession = async () => {
    return await window.auth.session();
};

export { requestSession };
