import { memo, useMemo } from 'react';
import { number } from '@common/utils/format';
import { toUTCStringPretty } from '@common/utils/date';
import { getVersionLoader } from '@renderer/utils/version';
import MinecraftIcon from '../../../assets/images/minecraft/grass_block.png';
import FabricIcon from '../../../assets/images/minecraft/fabric.png';
import NeoForgeIcon from '../../../assets/images/minecraft/neoforge.png';
import ForgeIcon from '../../../assets/images/minecraft/forge.png';
import PapermcIcon from '../../../assets/images/minecraft/papermc.png';
import IrisIcon from '../../../assets/images/minecraft/iris.png';
import { SelectPromptModal, useModal } from '@renderer/components/modal';
import { ModVersionFile, ProjectVersion } from '@xmcl/modrinth';

const loaderIconMap: Record<string, string> = {
    neoforge: NeoForgeIcon,
    fabric: FabricIcon,
    forge: ForgeIcon,
    bukkit: PapermcIcon,
    bungeecord: PapermcIcon,
    iris: IrisIcon,
};

const LoaderIcon = memo(({ loader }: { loader: string }) => {
    const icon = loaderIconMap[loader] || MinecraftIcon;
    return <img src={icon} className="size-5" />;
});

interface Props {
    file: ModVersionFile;
    projectVersion: ProjectVersion;
    versions: any[];
    downloadFile: (id: string, file: ModVersionFile) => Promise<void>;
}

export const VersionItem = memo(({
    file,
    projectVersion,
    versions,
    downloadFile,
}: Props) => {
    // 缓存所有计算属性（避免重复计算）
    const { version_type, date_published, downloads, loaders, game_versions } = projectVersion;

    const mainLoader = loaders[0] || 'minecraft';
    const MainIcon = useMemo(() => loaderIconMap[mainLoader] || MinecraftIcon, [mainLoader]);
    const formattedDate = useMemo(() => toUTCStringPretty(date_published), [date_published]);
    const formattedDownloads = useMemo(() => number.format(downloads), [downloads]);
    const versionTypeText = useMemo(() => {
        switch (version_type) {
        case 'release': return 'Release version';
        case 'beta': return 'Beta version';
        default: return 'Alpha';
        }
    }, [version_type]);

    const { openModal } = useModal();

    const modalItems = useMemo(() => {
        return versions
            .filter(version => game_versions.includes(version.minecraftVersion))
            .map(version => {
                const loader = getVersionLoader(version);
                return {
                    label: version.id,
                    icon: <LoaderIcon loader={loader} />,
                    onSelect: () => downloadFile(version.id, file),
                };
            });
    }, [versions, game_versions, file, downloadFile]);

    return (
        <div
            className="w-full h-12 flex flex-row space-x-3 items-center cursor-pointer rounded-lg hover:bg-blue-100 dark:hover:bg-neutral-700 transition-colors will-change-background" // 优化6：减少动画监控属性
            onClick={() => openModal(SelectPromptModal, {
                title: `${version_type}-${projectVersion.version_number}`,
                items: modalItems,
            })}
        >
            <div className="ml-3 w-8 h-8 flex-shrink-0">
                <img
                    src={MainIcon}
                    className="w-full h-full rounded-md"
                />
            </div>
            <div className="w-full h-full flex flex-col items-start justify-center">
                <p className="text-sm text-gray-700 dark:text-gray-50">
                    {projectVersion.name}
                </p>
                <p className="text-xs text-gray-400">
                    {file.filename}, Last updated {formattedDate}, {formattedDownloads} Downloads, {versionTypeText}
                </p>
            </div>
        </div>
    );
});