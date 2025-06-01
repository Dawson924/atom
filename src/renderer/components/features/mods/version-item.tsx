import FabricIcon from '../../../assets/images/minecraft/fabric.png';
import NeoForgeIcon from '../../../assets/images/minecraft/neoforge.png';
import ForgeIcon from '../../../assets/images/minecraft/forge.png';
import { SelectPromptModal } from '@renderer/components/modal';
import { getVersionLoader } from '@renderer/utils/version';
import { ModVersionFile, ProjectVersion } from '@xmcl/modrinth';
import { memo } from 'react';
import { number } from '@common/utils/format';
import { toUTCStringPretty } from '@common/utils/date';

export const VersionItem = memo(({
    file,
    projectVersion,
    versions,
    openModal,
    downloadFile
}: {
    file: ModVersionFile;
    projectVersion: ProjectVersion;
    versions: any[];
    openModal: any;
    downloadFile: (id: string, file: ModVersionFile) => Promise<void>;
}) => {
    return (
        <div
            className="w-full h-12 flex flex-row space-x-3 items-center cursor-pointer rounded-lg hover:bg-blue-100 dark:hover:bg-neutral-700 transition-all will-change-transform"
            onClick={() => {
                openModal(SelectPromptModal, {
                    title: `${projectVersion.version_type}-${projectVersion.version_number}`,
                    items: versions
                        .filter(version => projectVersion.game_versions.includes(version.minecraftVersion))
                        .map(version => ({
                            label: version.id,
                            icon: (
                                <img
                                    src={
                                        getVersionLoader(version) === 'neoforge' ? (
                                            NeoForgeIcon
                                        ) : getVersionLoader(version) === 'fabric' ? (
                                            FabricIcon
                                        ) : null
                                    }
                                    className="size-5"
                                />
                            ),
                            onSelect: () => downloadFile(version.id, file)
                        }))
                });
            }}
        >
            <div className="ml-3 w-8 h-8 flex-shrink-0">
                <img
                    src={
                        projectVersion.loaders.includes('neoforge') ? (
                            NeoForgeIcon
                        ) : projectVersion.loaders.includes('fabric') ? (
                            FabricIcon
                        ) : projectVersion.loaders.includes('forge') ? (
                            ForgeIcon
                        ) : null
                    }
                    className="w-full h-full rounded-md"
                />
            </div>
            <div className="w-full h-full flex flex-col items-start justify-center">
                <p className="text-sm text-gray-700 dark:text-gray-50">
                    {projectVersion.name}
                </p>
                <p className="text-xs text-gray-400 space-x-1">
                    <span>{`${file.filename}, `}</span>
                    <span>{`Last updated ${toUTCStringPretty(projectVersion.date_published)}, `}</span>
                    <span>{`${number.format(projectVersion.downloads)} Downloads, `}</span>
                    <span>{
                        `${projectVersion.version_type === 'release' ? ('Release version')
                            : projectVersion.version_type === 'beta' ? ('Beta version')
                                : ('Alpha')}`}
                    </span>
                </p>
            </div>
        </div>
    );
});
