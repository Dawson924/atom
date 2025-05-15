import { useEffect, useState } from 'react';
import { useNavigate } from '../../router';
import * as skinview3d from 'skinview3d';
import type { AccountSession } from '../../../libs/auth';

export default function HomePage() {
    const navigate = useNavigate();

    const [versionName, setVersionName] = useState<string | undefined>();
    const [session, setSession] = useState<AccountSession>();
    const [launchMode, setLaunchMode] = useState<string>('offline');
    const [skinUrl, setSkinUrl] = useState<string>('');

    useEffect(() => {
        window.store.get('launcher.launchVersion').then(setVersionName);
        window.store.get('authentication.mode').then(setLaunchMode);
        window.auth.session().then(setSession);
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
        if (!skinUrl || launchMode === 'offline') return;

        const skinViewer = new skinview3d.SkinViewer({
            canvas: document.getElementById('skin-container') as HTMLCanvasElement,
            width: 300,
            height: 220,
            skin: skinUrl,
            enableControls: false,
        });
        // Change camera FOV
        skinViewer.fov = 70;
        // Zoom out
        skinViewer.zoom = 0.92;
        // Rotate the player
        skinViewer.autoRotate = false;
        // Apply an animation
        skinViewer.animation = new skinview3d.WalkingAnimation();
        // Set the speed of the animation
        skinViewer.animation.speed = 0.75;

    }, [skinUrl, launchMode]);


    const changeLaunchMode = (mode: string) => {
        setLaunchMode(mode);
        window.store.set('authentication.mode', mode);
    };

    if (!session) return null;

    return (
        <>
            <div className="h-main bg-blue-100 dark:bg-neutral-700">
                <div className="flex flex-row">

                    <div className="z-10 w-[300px] h-main flex flex-shrink-0 flex-col shadow-lg border-r border-gray-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                        <div className="px-4 mt-4 h-full flex flex-col items-center">
                            {/* Segmented Controls */}
                            <div className="inline-flex h-9 w-auto items-baseline justify-start rounded-lg bg-gray-100 p-1">
                                <MenuItem
                                    value="Mojang"
                                    selected={launchMode === 'yggdrasil'}
                                    icon={<YggdrasilIcon />}
                                    onClick={() => changeLaunchMode('yggdrasil')}
                                />

                                <MenuItem
                                    value="Offline"
                                    selected={launchMode === 'offline'}
                                    icon={<GitHubIcon />}
                                    onClick={() => changeLaunchMode('offline')}
                                />
                            </div>
                            {/* Character preview */}
                            <div className="mt-4 w-full h-full flex flex-col items-center">
                                {
                                    (skinUrl && launchMode !== 'offline') && (
                                        <canvas id="skin-container"></canvas>
                                    )
                                }
                            </div>
                        </div>
                        <div className="p-5 w-full h-40 space-y-4">
                            <div
                                className="w-full h-16 flex flex-col justify-center items-center transition-all cursor-pointer border rounded-lg border-blue-400 hover:bg-blue-100 dark:border-blue-500 dark:hover:bg-blue-500"
                                onClick={async () => {
                                    if (!versionName)
                                        return navigate('home/versions');

                                    window.launcher.launch(versionName, await window.store.get('launcher.javaPath'));
                                }}
                            >
                                <h3 className="text-xl font-semibold font-[Inter] text-gray-900 dark:text-gray-200">Launch</h3>
                                <p className="text-xs font-[Inter] text-gray-400">{versionName ?? 'Choose a minecraft version'}</p>
                            </div>
                            <div className="grid grid-cols-2 space-x-2">
                                <div
                                    className="h-9 flex flex-col justify-center items-center transition-all cursor-pointer border rounded-md border-gray-500 hover:bg-gray-100 dark:border-gray-400 dark:hover:bg-gray-200 group"
                                    onClick={() => navigate('/home/versions')}
                                >
                                    <h4 className="lowercase tracking-wide text-sm font-semibold font-[Inter] text-gray-700 dark:text-gray-200 group-hover:text-gray-950">versions</h4>
                                </div>
                                <div
                                    className="h-9 flex flex-col justify-center items-center transition-all cursor-pointer border rounded-md border-gray-500 hover:bg-gray-100 dark:border-gray-400 dark:hover:bg-gray-200 group"
                                    onClick={() => navigate('/home/manage')}
                                >
                                    <h4 className="lowercase tracking-wide text-sm font-semibold font-[Inter] text-gray-700 dark:text-gray-200 group-hover:text-gray-950">manage</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-6 w-full h-main">

                    </div>

                </div>
            </div>
        </>
    );
}

const MenuItem: React.FC<any> = ({ value, selected, icon, onClick }) => {
    const baseClasses = 'group inline-flex w-28 items-center justify-center whitespace-nowrap py-2 align-middle font-semibold transition-all duration-300 ease-in-out disabled:cursor-not-allowed min-w-[32px] gap-1.5 text-xs h-7 px-3 cursor-pointer';

    const selectedClasses = 'rounded-md bg-white text-gray-950 drop-shadow';
    const unselectedClasses = 'rounded-lg bg-transparent text-gray-600';

    return (
        <button
            type="button"
            className={`${baseClasses} ${selected ? selectedClasses : unselectedClasses}`}
            onClick={onClick}
        >
            {icon}
            <div>{value}</div>
        </button>
    );
};

// Yggdrasil 图标组件
const YggdrasilIcon = () => (
    <svg
        className="size-4"
        version="1.1"
        id="Icons"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 32 32"
        xmlSpace="preserve"
        fill="#000000"
    >
        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
        <g id="SVGRepo_iconCarrier">
            <style
                type="text/css"
                dangerouslySetInnerHTML={{
                    __html:
                        ' .st0{fill:none;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} '
                }}
            />
            <path
                className="st0"
                d="M26,20c-1.1,0-2.1,0.4-3,1H18c-0.8-0.6-1.9-1-3-1c-2.8,0-5,2.2-5,5s2.2,5,5,5c1.1,0,2.1-0.4,3-1H23 c0.8,0.6,1.9,1,3,1c2.8,0,5-2.2,5-5S28.8,20,26,20z"
            />
            <line className="st0" x1={15} y1={23} x2={15} y2={27} />
            <line className="st0" x1={13} y1={25} x2={17} y2={25} />
            <line className="st0" x1={27} y1={24} x2={27} y2={24} />
            <line className="st0" x1={25} y1={26} x2={25} y2={26} />
            <path
                className="st0"
                d="M10.7,27.6C5.1,26.1,1,21,1,15C1,7.8,6.8,2,14,2s13,5.8,13,13c0,1.8-0.4,3.5-1,5"
            />
            <path
                className="st0"
                d="M10,24.7c-1.2-2.4-2-5.8-2-9.7c0-7.2,2.7-13,6-13s6,5.8,6,13c0,2.2-0.2,4.2-0.7,6"
            />
            <line className="st0" x1={1} y1={15} x2={27} y2={15} />
        </g>
    </svg>
);

// GitHub 图标组件
const GitHubIcon = () => (
    <svg className="size-4" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
        <g id="SVGRepo_iconCarrier">
            <g id="Layer_2" data-name="Layer 2">
                <g id="invisible_box" data-name="invisible box">
                    <rect width={48} height={48} fill="none" stroke="none" />
                </g>
                <g id="Layer_6" data-name="Layer 6">
                    <g>
                        <path d="M25.6,25.6,22.2,29,19,25.8l3.4-3.4a2,2,0,0,0-2.8-2.8L16.2,23l-1.3-1.3a1.9,1.9,0,0,0-2.8,0l-3,3a9.8,9.8,0,0,0-3,7,9.1,9.1,0,0,0,1.8,5.6L4.6,40.6a1.9,1.9,0,0,0,0,2.8,1.9,1.9,0,0,0,2.8,0l3.2-3.2a10.1,10.1,0,0,0,5.9,1.9,10.2,10.2,0,0,0,7.1-2.9l3-3a2,2,0,0,0,.6-1.4,1.7,1.7,0,0,0-.6-1.4L25,31.8l3.4-3.4a2,2,0,0,0-2.8-2.8ZM20.8,36.4a6.1,6.1,0,0,1-8.5,0l-.4-.4a6.4,6.4,0,0,1-1.8-4.3,6,6,0,0,1,1.8-4.2l1.6-1.6,8.8,8.9Z" />
                        <path d="M43.4,4.6a1.9,1.9,0,0,0-2.8,0L37.2,8a10,10,0,0,0-13,.9l-3,3a2,2,0,0,0-.6,1.4,1.7,1.7,0,0,0,.6,1.4L32.9,26.4a1.9,1.9,0,0,0,2.8,0l3-2.9a9.9,9.9,0,0,0,2.9-7.1A10.4,10.4,0,0,0,40,10.9l3.4-3.5A1.9,1.9,0,0,0,43.4,4.6Zm-7.5,16-1.6,1.6-8.9-8.9L27,11.8a5.9,5.9,0,0,1,8.5,0l.4.3a6.3,6.3,0,0,1,1.7,4.3A5.9,5.9,0,0,1,35.9,20.6Z" />
                    </g>
                </g>
            </g>
        </g>
    </svg>

);
