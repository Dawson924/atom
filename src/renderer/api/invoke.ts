async function invokeHandler<T>(event: string, ...args: any[]): Promise<T> {
    const result = await window.api.invoke(event, ...args);
    return result.success ? result.data as T : Promise.reject(result.error);
}

export { invokeHandler };
