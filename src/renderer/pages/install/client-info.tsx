import { useContext, useEffect, useRef, useState } from 'react';
import { Container } from '@renderer/components/commons';
import { FabricArtifactVersion } from '@xmcl/installer';
import MinecraftIcon from '../../assets/images/minecraft/grass_block.png';
import FabricIcon from '../../assets/images/minecraft/fabric.png';
import { Context } from './page';
import { Fab } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useToast } from '@renderer/hoc/toast';
import { ClientService } from '@renderer/api';
import clsx from 'clsx';

export default function ClientInfoPage({ version }: {
    version: string;
}) {
    if (!version) return null;

    const { goTo, executeTask, taskState } = useContext(Context);
    const { addToast } = useToast();

    const [versionName, setVersionName] = useState<string>(version);
    const [modLoader, setModLoader] = useState<{ loader: 'forge' | 'fabric' | 'neoForge'; version: string }>();
    const [fabricArtifacts, setFabricArtifacts] = useState<FabricArtifactVersion[]>();
    const [fabricExpanded, setFabricExpanded] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef(null);

    useEffect(() => {
        ClientService.getFabricArtifacts().then(setFabricArtifacts);
    }, []);

    useEffect(() => {
        if (contentRef.current) {
            const calculateHeight = () => {
                const height = contentRef.current.scrollHeight;
                setContentHeight(height);
            };

            // 初始计算
            calculateHeight();

            // 监听内容变化
            const observer = new ResizeObserver(calculateHeight);
            observer.observe(contentRef.current);

            return () => observer.disconnect();
        }
    }, [fabricArtifacts]); // 依赖项根据实际数据变化调整

    const executeDownload = async () => {
        if (!version || !versionName) return;
        goTo('client');
        if (!modLoader) {
            await installMinecraft();
        }
        else if (modLoader.loader === 'fabric') {
            await installFabric();
        }
    };

    const installMinecraft = async () => {
        await executeTask({
            id: versionName,
            version: version,
            onComplete: () => addToast(`installed successfully (${version})`),
        });
    };

    const installFabric = async () => {
        await executeTask({
            id: versionName,
            version: version,
            loader: modLoader.loader,
            loaderVersion: modLoader.version,
            onComplete: () => addToast(`installed successfully (${version})`),
        });
    };

    if (!fabricArtifacts) return null;

    return (
        <>
            <Container>
                <div className="px-4 py-2 mb-8 space-x-2 flex items-center shadow-md rounded-lg bg-neutral-50 dark:bg-neutral-800">
                    <button
                        className="size-8 cursor-pointer"
                        onClick={() => goTo('client')}
                    >
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-50" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.3508 12.7499L11.2096 17.4615L10.1654 18.5383L3.42264 11.9999L10.1654 5.46148L11.2096 6.53833L6.3508 11.2499L21 11.2499L21 12.7499L6.3508 12.7499Z"
                                />
                            </g>
                        </svg>
                    </button>
                    <div className="size-8 flex-shrink-0">
                        <img
                            src={modLoader && modLoader.loader === 'fabric' ?
                                FabricIcon
                                :
                                MinecraftIcon
                            }
                            className="w-full h-full"
                        />
                    </div>
                    <div className="px-2 w-full h-9.5 flex flex-row space-x-3 items-center rounded-lg">
                        <div className="w-full min-w-80">
                            <input
                                className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow"
                                defaultValue={versionName}
                                onChange={({ target: { value } }) => setVersionName(value)}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className={clsx(
                        'px-4 mb-6 shadow-md rounded-lg bg-neutral-50 dark:bg-neutral-800 cursor-pointer',
                        fabricExpanded && 'pb-2'
                    )}>
                    <div
                        className="transition-all duration-400 ease-in-out cursor-pointer"
                    >
                        <button
                            type="button"
                            className="px-2 py-3 w-full flex items-center justify-between cursor-pointer"
                            onClick={() => setFabricExpanded(pre => !pre)}
                        >
                            <div className="space-x-6 flex flex-row justify-start items-center">
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Fabric</h2>
                                <span className="text-sm text-gray-500">
                                    {
                                        modLoader && modLoader.loader === 'fabric' ?
                                            modLoader.version
                                            :
                                            'Choose a version'
                                    }
                                </span>
                            </div>
                            <svg
                                id="arrow1"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="size-5 text-gray-400"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        <div
                            style={{
                                maxHeight: fabricExpanded ? `${contentHeight}px` : '0',
                                opacity: fabricExpanded ? 1 : 0
                            }}
                            className="overflow-hidden transition-all duration-400 ease-in-out"
                        >
                            <div ref={contentRef} className="flex flex-col px-2">
                                {fabricArtifacts.map(artifact => {
                                    return (<div
                                        key={artifact.version}
                                        className="w-full h-12 flex flex-row space-x-4 items-center cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-neutral-700 transition-all hover:scale-101"
                                        onClick={() => {
                                            setModLoader({ loader: 'fabric', version: artifact.version });
                                            setFabricExpanded(false);
                                        }}
                                    >
                                        <div className="ml-3 w-8 h-8 flex-shrink-0">
                                            <img
                                                src={FabricIcon}
                                                className="w-full h-full"
                                            />
                                        </div>
                                        <div className="w-full h-full flex flex-col items-start justify-center">
                                            <p className="text-sm font-light text-gray-900 dark:text-gray-50">{artifact.version}</p>
                                            <p className="text-xs text-gray-400">{artifact.stable ? 'Stable' : 'Test'}</p>
                                        </div>
                                    </div>);
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: taskState && 'none' }} className="fixed inset-x-0 bottom-4 flex flex-row justify-center">
                    <button
                        className="px-5 py-2 w-40 flex flex-row gap-2 justify-center items-center font-light text-white rounded-full bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer"
                        onClick={executeDownload}
                    >
                        <svg
                            className="size-4 text-white"
                            viewBox="0 0 26 26"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="currentColor"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                            <g id="SVGRepo_iconCarrier">
                                <title />
                                <g id="Complete">
                                    <g id="download">
                                        <g>
                                            <path
                                                d="M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                            />
                                            <g>
                                                <polyline
                                                    data-name="Right"
                                                    fill="none"
                                                    id="Right-2"
                                                    points="7.9 12.3 12 16.3 16.1 12.3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                />
                                                <line
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    x1={12}
                                                    x2={12}
                                                    y1="2.7"
                                                    y2="14.2"
                                                />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        Download
                    </button>
                </div>

                <Fab
                    className="fixed right-4 bottom-4"
                    size="medium"
                    color="error"
                    ria-label="add"
                    onClick={() => setModLoader(null)}
                >
                    <Delete />
                </Fab>
            </Container>
        </>
    );
}
