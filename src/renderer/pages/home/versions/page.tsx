import MinecraftIcon from '../../../assets/images/minecraft/grass_block.png';
import FabricIcon from '../../../assets/images/minecraft/fabric.png';

import { MinecraftFolder, ResolvedVersion } from '@xmcl/core';
import { useEffect, useState } from 'react';
import { truncateWithEllipsis } from '../../../../common/utils/string';
import { useNavigate } from '../../../router';
import { Card, Container, Form } from '@renderer/components/commons';
import { ClientService, ConfigService } from '@renderer/api';

export default function VersionsPage() {
    const navigate = useNavigate();

    const [folder, setFolder] = useState<MinecraftFolder>();
    const [versions, setLocalVersions] = useState<ResolvedVersion[]>();

    useEffect(() => {
        ClientService.getFolder().then(res => setFolder(res));
        ClientService.getVersions().then(res => setLocalVersions(res || []));
    }, []);

    if (!folder || !versions) return null;

    return (
        <div className="h-main bg-blue-100 dark:bg-neutral-700">
            <div className="flex flex-row">

                <div className="z-10 w-[250px] h-main flex flex-shrink-0 flex-col shadow-lg border-r border-gray-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                    <div className="w-full h-full">
                        <div className="px-5 pt-3 mb-1">
                            <h2 className="text-xs font-semibold font-[Inter] tracking-tighter uppercase text-gray-400">
                                Folders
                            </h2>
                        </div>
                        <nav aria-label="Main" className="flex flex-col h-full">
                            {/* Links */}
                            <div className={'flex-1 text-sm font-semibold overflow-hidden hover:overflow-auto'}>
                                <div
                                    className="relative flex flex-col justify-center items-start px-4 py-2 w-full cursor-pointer text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-neutral-700"
                                >
                                    <div className="absolute left-0.5 top-1/4 h-1/2 rounded-sm border-l-3 border-blue-700 dark:border-blue-400"></div>
                                    <p className="text-sm font-semibold font-[Inter]">
                                        Default Folder
                                    </p>
                                    <p className="text-xs font-[Inter] text-gray-400">{truncateWithEllipsis(folder.root, 30)}</p>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>

                <Container>
                    {versions.some(ver => ver.mainClass==='net.minecraft.client.main.Main') &&
                    <Card
                        title="Minecraft"
                        className="mb-6"
                    >
                        <Form>
                            {
                                versions?.map((version: ResolvedVersion) => {
                                    if (version.mainClass === 'net.minecraft.client.main.Main')
                                        return (
                                            <div
                                                key={version.id}
                                                className="px-3 w-full h-12 flex flex-row space-x-3 items-center cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-neutral-700 transition-all hover:scale-101"
                                                onClick={() => {
                                                    ConfigService.set('launch.launchVersion', version.id).then(() => navigate('home'));
                                                }}
                                            >
                                                <div className="w-8 h-8 flex-shrink-0">
                                                    <img
                                                        src={MinecraftIcon}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                                <div className="w-full h-full flex flex-col items-start justify-center">
                                                    <p className="text-sm font-light text-gray-900 dark:text-gray-50">{version.id}</p>
                                                    <p className="text-xs text-gray-400">{version.minecraftVersion}</p>
                                                </div>
                                            </div>
                                        );
                                })
                            }
                        </Form>
                    </Card>}
                    {versions.some(ver => ver.mainClass==='net.fabricmc.loader.impl.launch.knot.KnotClient') &&
                    <Card
                        title="Fabric"
                        className="mb-6"
                    >
                        <Form>
                            {
                                versions?.map((version: ResolvedVersion) => {
                                    if (version.mainClass === 'net.fabricmc.loader.impl.launch.knot.KnotClient')
                                        return (
                                            <div
                                                key={version.id}
                                                className="px-3 w-full h-12 flex flex-row space-x-3 items-center cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-neutral-700 transition-all hover:scale-101"
                                                onClick={() => {
                                                    ConfigService.set('launch.launchVersion', version.id).then(() => navigate('home'));
                                                }}
                                            >
                                                <div className="w-8 h-8 flex-shrink-0">
                                                    <img
                                                        src={FabricIcon}
                                                        className="w-full h-full"
                                                    />
                                                </div>
                                                <div className="w-full h-full flex flex-col items-start justify-center">
                                                    <p className="text-sm font-light text-gray-900 dark:text-gray-50">{version.id}</p>
                                                    <p className="text-xs text-gray-400">{version.minecraftVersion}</p>
                                                </div>
                                            </div>
                                        );
                                })
                            }
                        </Form>
                    </Card>}
                </Container>

            </div>
        </div>
    );
}
