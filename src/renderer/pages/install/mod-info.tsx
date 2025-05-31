import FabricIcon from '../../assets/images/minecraft/fabric.png';
import NeoForgeIcon from '../../assets/images/minecraft/neoforge.png';
import ForgeIcon from '../../assets/images/minecraft/forge.png';
import { toUTCStringPretty } from '@common/utils/date';
import { ClientService } from '@renderer/api';
import { Accordion, Card, Container } from '@renderer/components/commons';
import { useModal, SelectPromptModal } from '@renderer/hoc/modal';
import { useToast } from '@renderer/hoc/toast';
import { useClient } from '@renderer/hooks';
import { getVersionLoader } from '@renderer/utils/version';
import { ModrinthV2Client, ModVersionFile, Project, ProjectVersion } from '@xmcl/modrinth';
import { useEffect, useState } from 'react';
import { useInstallPage } from '@renderer/hooks/store';
import { number } from '@common/utils/format';

const client = new ModrinthV2Client();

export default function ModInfoPage({ project }: { project: Project }) {
    const { goTo } = useInstallPage();
    const { versions } = useClient();
    const { openModal } = useModal();
    const { addToast } = useToast();

    const [projectVersions, setProjectVersions] = useState<ProjectVersion[]>(null);
    const [expandedVersion, setExpandedVersion] = useState<string>(null);

    useEffect(() => {
        if (project) {
            client.getProjectVersions(project.id)
                .then(setProjectVersions);
        }
        else {
            setProjectVersions(null);
            setExpandedVersion(null);
        }
    }, [project]);

    const installMod = (id: string, file: ModVersionFile) => {
        ClientService.installMod(id, file)
            .then(() => {
                addToast(`Install '${file.filename}' successfully`);
            });
    };

    return (
        <Container>
            <Card
                className="px-4 py-2 mb-6 flex flex-col items-start animate-[slide-down_0.2s_ease-in]"
            >
                <button
                    className="size-6 flex cursor-pointer"
                    onClick={() => goTo('mods')}
                >
                    <svg className="w-full h-full text-gray-700 dark:text-gray-50" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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
                <div className="h-20 w-full space-x-4 flex flex-row items-center">
                    <div className="size-14 flex-shrink-0">
                        <img
                            src={project.icon_url}
                            className="size-full rounded-md"
                        />
                    </div>
                    <div className="w-full h-full flex flex-col items-start justify-center">
                        <p className="text-sm text-gray-950 dark:text-gray-50">{project.title}</p>
                        <p className="md:w-xl lg:w-3xl xl:w-5xl text-xs overflow-hidden whitespace-nowrap text-ellipsis text-gray-400">{project.description}</p>
                        <div className="mt-1 w-full grid grid-cols-3">
                            <div className="text-xs text-gray-400 inline-flex items-center gap-1">
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z" />
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                </svg>
                                <p>{project.loaders.slice(0, 2).join(' / ')}</p>
                                <p className="ml-0.5">{project.game_versions[0]}</p>
                            </div>
                            <div className="text-xs text-gray-400 inline-flex items-center gap-1">
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4" />
                                </svg>
                                {number.format(project.downloads)}
                            </div>
                            <div className="text-xs text-gray-400 inline-flex items-center gap-1">
                                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 20V7m0 13-4-4m4 4 4-4m4-12v13m0-13 4 4m-4-4-4 4" />
                                </svg>
                                {toUTCStringPretty(project.updated)}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            {project && projectVersions &&
                <div className="flex flex-col">
                    {
                        project.game_versions.toReversed().map(version => {
                            if (!version.includes('.') || version.includes('-'))
                                return;
                            return (
                                <Accordion
                                    open={expandedVersion === version}
                                    title={version}
                                    className="mb-4"
                                    onClick={() => setExpandedVersion(prev => prev !== version ? version : null)}
                                >
                                    {
                                        projectVersions.map(projectVersion => {
                                            if (!projectVersion.game_versions.includes(version))
                                                return;
                                            return projectVersion.files.map(file => {
                                                return (
                                                    <div
                                                        key={file.filename}
                                                        className="w-full h-12 flex flex-row space-x-3 items-center cursor-pointer rounded-lg hover:bg-blue-100 dark:hover:bg-neutral-700 transition-all will-change-transform"
                                                        onClick={() => {
                                                            openModal(SelectPromptModal, {
                                                                title: `${projectVersion.version_type}-${projectVersion.version_number}`,
                                                                items: versions.map(version => {
                                                                    if (!projectVersion.game_versions.includes(version.minecraftVersion)) {
                                                                        return;
                                                                    }
                                                                    else if (!projectVersion.loaders.includes(getVersionLoader(version))) {
                                                                        return;
                                                                    }
                                                                    return {
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
                                                                        onSelect: () => installMod(version.id, file)
                                                                    };
                                                                }).filter(Boolean)
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
                                        })
                                    }
                                </Accordion>
                            );
                        })
                    }
                </div>}
        </Container>
    );
}
