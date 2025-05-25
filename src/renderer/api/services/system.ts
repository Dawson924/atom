export const SystemService = {
    totalMemory: async () => await window.api.invoke('util:get-total-memory'),
    memoryUsage: async () => await window.api.invoke('util:get-memory-usage'),
};
