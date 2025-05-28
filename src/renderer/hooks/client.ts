import { ClientService } from '@renderer/api';
import { MinecraftFolder, ResolvedVersion } from '@xmcl/core';
import { useEffect, useState } from 'react';

export function useClient() {
    const [folder, setFolder] = useState<MinecraftFolder>();
    const [versions, setVersions] = useState<ResolvedVersion[]>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [folder, versions] = await Promise.all([
                ClientService.getFolder(),
                ClientService.getVersions(),
            ]);
            setFolder(folder);
            setVersions(versions);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        folder,
        versions,
        loading,
        error,
    };
}
