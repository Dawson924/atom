import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import * as skinview3d from 'skinview3d';
import type { AccountSession } from '../../../libs/auth';

export default function AccountPage() {
    const [session, setSession] = useState<AccountSession>();
    const [skinUrl, setSkinUrl] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [server, setServer] = useState<string>();

    const fetch = () => {
        window.auth.session().then(setSession);
        window.store.get('authentication.yggdrasilAgent.server').then(setServer);
    };

    useEffect(() => {
        fetch();
    }, []);

    useEffect(() => {
        if (session && session.signedIn) {
            window.auth.lookup(session.profile.id).then(async (profile) => {
                const textureInfo = JSON.parse(atob(profile.properties.textures));
                setSkinUrl(textureInfo.textures.SKIN.url);
            });
        }
    }, [session]);

    useEffect(() => {
        if (!skinUrl || !session || !session.signedIn) return;

        const skinViewer = new skinview3d.SkinViewer({
            canvas: document.getElementById('skin-container') as HTMLCanvasElement,
            width: 300,
            height: 200,
            skin: skinUrl,
            enableControls: false
        });
        // Change camera FOV
        skinViewer.fov = 50;
        // Zoom out
        skinViewer.zoom = 0.9;

    }, [skinUrl, session]);

    const handleLogin = async () => {
        await window.auth.login({ username, password });
        fetch();
    };

    const handleLogout = async () => {
        await window.auth.invalidate();
        fetch();
    };

    if (!session) return null;

    return (
        <div className="px-4 py-6 w-full h-main flex flex-col overflow-y-auto">
            <div className="relative pb-2 mb-6 shadow-md rounded-lg bg-neutral-50 dark:bg-neutral-800 group">
                <div className="px-5 pt-3 mb-2">
                    <h2 className="text-xs font-bold font-[Inter] uppercase text-gray-900 dark:text-gray-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                        {session.signedIn ? `Hello, ${session.profile.name}` : 'Sign In'}
                    </h2>
                </div>
                <div style={{ display: session.signedIn ? 'none' : 'flex' }} className="flex-col px-5">
                    {/* Form */}
                    <div className="px-2 mb-2 w-full h-9.5 flex flex-row space-x-3 items-center cursor-pointer rounded-lg">
                        <div>
                            <h4 className="text-sm text-gray-900 dark:text-gray-50">Username</h4>
                        </div>
                        <div className="ml-auto w-full max-w-lg min-w-[200px]">
                            <input
                                name="username"
                                className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow"
                                defaultValue={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="px-2 mb-2 w-full h-9.5 flex flex-row space-x-3 items-center cursor-pointer rounded-lg">
                        <div>
                            <h4 className="text-sm text-gray-900 dark:text-gray-50">Password</h4>
                        </div>
                        <div className="ml-auto w-full max-w-lg min-w-[200px]">
                            <input
                                name="password"
                                className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow"
                                defaultValue={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div style={{ display: session.signedIn ? 'block' : 'none' }} className="px-7 mt-3">
                    <div className="px-2 w-full h-6 flex flex-row space-x-3 items-center cursor-pointer rounded-lg">
                        <div className="w-16">
                            <h4 className="text-sm text-gray-900 dark:text-gray-50">Uid: </h4>
                        </div>
                        <div className="w-full max-w-lg min-w-[200px]">
                            <p className="text-sm text-gray-500">{session.profile?.id}</p>
                        </div>
                    </div>
                    <div className="px-2 w-full h-6 flex flex-row space-x-3 items-center cursor-pointer rounded-lg">
                        <div className="w-16">
                            <h4 className="text-sm text-gray-900 dark:text-gray-50">Name: </h4>
                        </div>
                        <div className="w-full max-w-lg min-w-[200px]">
                            <p className="text-sm text-gray-500">{session.profile?.name}</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: session.signedIn ? 'grid' : 'none' }} className="w-full grid-cols-2">
                    <canvas id="skin-container" className="mr-auto"></canvas>
                </div>
                <div className="px-7 my-2 space-x-4 inline-flex justify-start items-center">
                    {
                        !session.signedIn ?
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                            :
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleLogout}
                            >
                                Sign out
                            </Button>
                    }
                </div>
            </div>
            <div className="pb-2 mb-6 shadow-md rounded-lg bg-neutral-50 dark:bg-neutral-800 group">
                <div className="px-5 pt-3 mb-2">
                    <h2 className="text-xs font-bold font-[Inter] uppercase text-gray-900 dark:text-gray-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
                        Server
                    </h2>
                </div>
                <div className="flex flex-col px-5">
                    {/* Form */}
                    <div className="px-2 mb-2 w-full h-9.5 flex flex-row space-x-3 items-center cursor-pointer rounded-lg">
                        <div>
                            <h4 className="text-sm text-gray-900 dark:text-gray-50">Server</h4>
                        </div>
                        <div className="ml-auto w-full max-w-lg min-w-[200px]">
                            <input
                                name="server"
                                className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow"
                                defaultValue={server}
                                onChange={(e) => window.store.set('authentication.yggdrasilAgent.server', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
