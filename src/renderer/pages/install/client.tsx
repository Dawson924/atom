import MinecraftIcon from '../../assets/images/minecraft/grass_block.png';
import CommandBlock from '../../assets/images/minecraft/command_block.png';

import { useContext } from 'react';
import { Context } from './page';
import { MinecraftVersion } from '@xmcl/installer';
import { toUTCStringPretty } from '../../../common/utils/date';
import { Card, Container, Form } from '@renderer/components/commons';
import ClientInfoPage from './client-info';

export default function ClientPage() {
    const { versionManifest, goTo } = useContext(Context);

    if (!versionManifest) return null;

    return (
        <>
            <Container>
                {/* Latest */}
                <Card
                    title="Latest"
                    className="mb-6"
                >
                    {/* Minecraft latest release & preview version */}
                    <div className="flex flex-col px-5">
                        <div
                            key={versionManifest.latest.release}
                            className="px-3 w-full h-12 flex flex-row space-x-3 items-center cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-neutral-700 transition-all hover:scale-101"
                            onClick={() => goTo(<ClientInfoPage version={versionManifest.latest.release} />)}
                        >
                            <div className="w-8 h-8 flex-shrink-0">
                                <img
                                    src={MinecraftIcon}
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="w-full h-full flex flex-col items-start justify-center">
                                <p className="text-sm font-light text-gray-900 dark:text-gray-50">{versionManifest.latest.release}</p>
                                <p className="text-xs text-gray-400">Release Version, {toUTCStringPretty(versionManifest.versions.find(ver => ver.id === versionManifest.latest.release).releaseTime)}</p>
                            </div>
                        </div>
                        <div
                            key={versionManifest.latest.snapshot}
                            className="px-3 w-full h-12 flex flex-row space-x-3 items-center cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-neutral-700 transition-all hover:scale-101"
                            onClick={() => goTo(<ClientInfoPage version={versionManifest.latest.snapshot} />)}
                        >
                            <div className="w-8 h-8 flex-shrink-0">
                                <img
                                    src={CommandBlock}
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="w-full h-full flex flex-col items-start justify-center">
                                <p className="text-sm font-light text-gray-900 dark:text-gray-50">{versionManifest.latest.snapshot}</p>
                                <p className="text-xs text-gray-400">Snapshot Version, {toUTCStringPretty(versionManifest.versions.find(ver => ver.id === versionManifest.latest.snapshot).releaseTime)}</p>
                            </div>
                        </div>
                    </div>
                </Card>
                {/* Minecraft Releases */}
                <Card
                    title={`Release (${versionManifest.versions.length})`}
                >
                    <Form>
                        {versionManifest.versions.filter(ver => ver.type === 'release').map((version: MinecraftVersion) => {
                            return (
                                <div
                                    key={version.id}
                                    className="px-3 w-full h-12 flex flex-row space-x-3 items-center cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-neutral-700 transition-all hover:scale-101"
                                    onClick={() => goTo(<ClientInfoPage version={version.id} />)}
                                >
                                    <div className="w-8 h-8 flex-shrink-0">
                                        <img
                                            src={MinecraftIcon}
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <div className="w-full h-full flex flex-col items-start justify-center">
                                        <p className="text-sm font-light text-gray-900 dark:text-gray-50">{version.id}</p>
                                        <p className="text-xs text-gray-400">{toUTCStringPretty(version.releaseTime)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </Form>
                </Card>
            </Container>
        </>
    );
}
