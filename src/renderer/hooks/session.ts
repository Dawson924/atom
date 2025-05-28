import { UserSession } from '@common/types/auth';
import { UserService } from '@renderer/api';
import { useEffect, useState } from 'react';

export const useSession = () => {
    const [session, setSession] = useState<UserSession>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSession();
    }, []);

    // 获取 session 数据
    const fetchSession = async () => {
        setLoading(true);
        try {
            const sessionData = await UserService.session();
            setSession(sessionData);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // 刷新 session 数据
    const refreshSession = async () => {
        setLoading(true);
        try {
            const newSessionData = await UserService.session();
            setSession(newSessionData);
            setError(null);
            return newSessionData; // 返回新的 session 数据
        } catch (err) {
            setError(err);
            throw err; // 抛出错误，让调用者可以处理
        } finally {
            setLoading(false);
        }
    };

    return { session, loading, error, refreshSession };
};
