import { useEffect, useState } from 'react';
import { Accordion, Container, Input, ListItem } from '@renderer/components/commons';
import { FabricArtifactVersion } from '@xmcl/installer';
import MinecraftIcon from '../../assets/images/minecraft/grass_block.png';
import FabricIcon from '../../assets/images/minecraft/fabric.png';
import { Fab } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useToast } from '@renderer/components/toast';
import { ClientService } from '@renderer/api';
import { useInstallPage, useTask } from '@renderer/hooks/store';


export default function ClientInfoPage({ version }: {
    version: string;
}) {
    if (!version) return null;

    const { goTo } = useInstallPage(state => state);
    const { addToast } = useToast();
    const { executeTask, currentTask } = useTask();

    const [versionName, setVersionName] = useState<string>(version);
    const [modLoader, setModLoader] = useState<{ loader: 'forge' | 'fabric' | 'neoForge'; version: string }>();
    const [fabricArtifacts, setFabricArtifacts] = useState<FabricArtifactVersion[]>();
    const [fabricExpanded, setFabricExpanded] = useState(false);

    useEffect(() => {
        ClientService.getFabricArtifacts().then(setFabricArtifacts);
    }, []);

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
                <div className="px-4 py-2 mb-8 space-x-2 flex items-center shadow-md rounded-lg bg-neutral-50 dark:bg-neutral-800 animate-[slide-down_0.1s_ease-in]">
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
                            <Input
                                defaultValue={versionName}
                                onChange={({ target: { value } }) => setVersionName(value)}
                            />
                        </div>
                    </div>
                </div>

                <Accordion
                    open={fabricExpanded}
                    title="Fabric"
                    description={
                        modLoader && modLoader.loader === 'fabric' ?
                            modLoader.version
                            :
                            'Choose a version'
                    }
                    className="mb-6 animate-[slide-down_0.4s_ease-in]"
                    onClick={() => setFabricExpanded(pre => !pre)}
                >
                    {fabricArtifacts.map((artifact, i) => {
                        if (i >= 19) return;
                        return (
                            <ListItem
                                src={FabricIcon}
                                title={artifact.version}
                                description={artifact.stable ? 'Stable' : 'Experimental'}
                                onClick={() => {
                                    setModLoader({ loader: 'fabric', version: artifact.version });
                                    setFabricExpanded(false);
                                }}
                            />
                        );
                    })}
                </Accordion>

                <div style={{ display: currentTask && 'none' }} className="fixed inset-x-0 bottom-4 flex flex-row justify-center">
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
