import _ from 'lodash';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Route {
    path: string;
    label?: string;
    icon?: Tentative
    element: Tentative;
    children: Route[];
    params?: any;
}

const PageContext = createContext<{ navigate: (path: string) => void } | undefined>(undefined);

const RouteProvider = ({ routes, path, setPath }: {
    routes: any[];
    path: string;
    setPath: (value: string) => unknown;
}): React.JSX.Element => {
    const [page, setPage] = useState<Route>();

    const navigate = (path?: string) => {
        if (path) {
            const [segments, params] = parseRoute(path);
            const target = matchRoute(segments, routes);

            _.set(target, 'params', params);
            if (target) {
                setPath(segments.join('/'));
                setPage(target);
            }
        }
        else {
            console.log('[ATOM] refreshed: ' + path);
            setPage(p => p);
        }
    };

    useEffect(() => {
        if (path)
            navigate(path);
        else {
            console.error('[ATOM]: Provided value \'path\' is not valid.');
        }
    }, [path]);

    if (!page) return null;

    return (
        <PageContext.Provider value={{ navigate }}>
            {addPropsToElement(page.element, page.params) || <></>}
        </PageContext.Provider>
    );
};

const parseRoute = (path: string): [string[], any] => {
    // 处理完整的URL或路径
    const url = new URL(path, 'http://dummybase'); // 使用虚拟基础URL来处理相对路径

    // 解析路径部分
    const pathParts = url.pathname.split('/').filter(part => part !== '');

    // 解析查询参数
    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
    });

    return [pathParts, queryParams];
};

const matchRoute = (segments: string[], routes: any[]): Route => {
    for (const route of routes) {
        if (route.path === segments[0]) {
            if (segments.length === 1) {
                return route;
            }
            else if (route.children) {
                const result = matchRoute(segments.slice(1), route.children);
                if (result) {
                    return result;
                }
            }
        }
    }
    return null;
};

const addPropsToElement = (element: React.JSX.Element, additionalProps: any) => {
    return React.cloneElement(element, additionalProps);
};

const useNavigate = () => {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error('useNavigate must be used within a RouteProvider');
    }
    return (path?: string) => context.navigate(path);
};

export { RouteProvider, useNavigate, addPropsToElement };
