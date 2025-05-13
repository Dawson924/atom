import GrassBlock from '../../assets/images/minecraft/grass_block.png';
import CommandBlock from '../../assets/images/minecraft/command_block.png';

import { useContext } from 'react';
import { Context } from './page';
import { MinecraftVersion } from '@xmcl/installer';
import { toUTCStringPretty } from '../../../utils/date';

export default function ClientPage() {
    const { versionManifest, executeTask } = useContext(Context);

    if (!versionManifest) return null;

    return (
        <>
            <div className="px-4 py-6 w-full h-main flex flex-col overflow-y-auto scroll-container">
                {/* Latest */}
                <div className="pb-2 mb-6 shadow-md rounded-lg bg-neutral-50 dark:bg-neutral-800">
                    <div className="px-5 pt-3">
                        <h2 className="text-xs font-semibold font-[Inter] uppercase text-gray-900 dark:text-gray-50">
                            Latest
                        </h2>
                    </div>
                    {/* Minecraft latest release & preview version */}
                    <div className="flex flex-col px-5">
                        <div
                            key={versionManifest.latest.release}
                            className="px-3 w-full h-12 flex flex-row space-x-3 items-center cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-neutral-700 transition-all hover:scale-101"
                        >
                            <div className="w-8 h-8 flex-shrink-0">
                                <img
                                    src={GrassBlock}
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="w-full h-full flex flex-col items-start justify-center">
                                <p className="text-sm font-light text-gray-900 dark:text-gray-50">{versionManifest.latest.release}</p>
                                <p className="text-xs text-gray-400">Release Version, {toUTCStringPretty(versionManifest.versions.find(ver => ver.id === versionManifest.latest.release).releaseTime)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col px-5">
                        <div
                            key={versionManifest.latest.snapshot}
                            className="px-3 w-full h-12 flex flex-row space-x-3 items-center cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-neutral-700 transition-all hover:scale-101"
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
                </div>
                {/* Minecraft Releases */}
                <div className="py-2 shadow-md rounded-lg bg-neutral-50 dark:bg-neutral-800">
                    <div className="px-5 pt-3 mb-2">
                        <h2 className="text-xs font-semibold font-[Inter] uppercase text-gray-900 dark:text-gray-50">
                            Release ({versionManifest.versions.length})
                        </h2>
                    </div>
                    <div className="flex flex-col px-5">
                        {
                            versionManifest.versions.filter(ver => ver.type === 'release').map((version: MinecraftVersion) => {
                                return (
                                    <div
                                        key={version.id}
                                        className="px-3 w-full h-12 flex flex-row space-x-3 items-center cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-neutral-700 transition-all hover:scale-101"
                                        onClick={() => executeTask({ version: version.id })}
                                    >
                                        <div className="w-8 h-8 flex-shrink-0">
                                            <img
                                                src={GrassBlock}
                                                className="w-full h-full"
                                            />
                                        </div>
                                        <div className="w-full h-full flex flex-col items-start justify-center">
                                            <p className="text-sm font-light text-gray-900 dark:text-gray-50">{version.id}</p>
                                            <p className="text-xs text-gray-400">{toUTCStringPretty(version.releaseTime)}</p>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
