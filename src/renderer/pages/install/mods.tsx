import { ModrinthV2Client, Project, ProjectVersion, SearchResultHit } from '@xmcl/modrinth';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { Card, Container, Form } from '@renderer/components/commons';
import { toUTCStringPretty } from '@common/utils/date';

type ModSearchFormData = {
    name: string;
    index: string;
};

const client = new ModrinthV2Client();

export default function ModsPage() {
    const [formData, setFormData] = useState<ModSearchFormData>({
        name: '',
        index: 'relevance'
    });
    const [resultHits, setResultHits] = useState<SearchResultHit[]>();
    const [modProject, setModProject] = useState<Project>(null);
    const [projectVersions, setProjectVersions] = useState<ProjectVersion[]>(null);
    const [expandedVersion, setExpandedVersion] = useState<string>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const fileContentRef = useRef(null);

    useEffect(() => {
        if (!resultHits)
            client.searchProjects({ index: 'downloads' })
                .then(result => result.hits)
                .then(setResultHits);
    }, []);

    useEffect(() => {
        if (modProject) {
            client.getProjectVersions(modProject.id)
                .then(setProjectVersions);
        }
        else {
            setProjectVersions(null);
            setExpandedVersion(null);
        }
    }, [modProject]);

    useEffect(() => {
        if (fileContentRef.current) {
            const calculateHeight = () => {
                const height = fileContentRef.current.scrollHeight;
                setContentHeight(height);
            };

            // 初始计算
            calculateHeight();

            // 监听内容变化
            const observer = new ResizeObserver(calculateHeight);
            observer.observe(fileContentRef.current);

            return () => observer.disconnect();
        }
    }, [projectVersions]); // 依赖项根据实际数据变化调整

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const searchMods = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        client.searchProjects({
            query: formData.name,
            index: formData.index,
        }).then(res => {
            setResultHits(res.hits);
        });
    };

    return (
        <>
            {!modProject ?
                <Container>
                    <Card
                        title="Search for mods"
                        className="mb-5"
                    >
                        <Form onSubmit={searchMods}>
                            <div className="grid grid-cols-3 gap-5">
                                <div className="px-2 mb-2 w-full h-9.5 col-span-2 flex flex-row space-x-3 items-center">
                                    <div className="w-14 shrink-0">
                                        <h3 className="text-sm text-gray-900 dark:text-gray-50 dark:bg-neutral-800 group">
                                            Name
                                        </h3>
                                    </div>
                                    <div className="w-full">
                                        <input
                                            name="name"
                                            className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow"
                                            defaultValue={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="px-2 mb-2 w-full h-9.5 col-span-1 flex flex-row space-x-3 items-center">
                                    <div className="w-14 shrink-0">
                                        <h3 className="text-sm text-gray-900 dark:text-gray-50 dark:bg-neutral-800 group">
                                            Sort by
                                        </h3>
                                    </div>
                                    <div className="relative w-full items-center">
                                        <select
                                            name="index"
                                            className="w-full h-9.5 bg-transparent placeholder:text-slate-400 text-gray-700 dark:text-gray-300 text-sm border border-slate-200 dark:border-neutral-500 rounded-md pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-xs focus:shadow appearance-none cursor-pointer"
                                            defaultValue={formData.index}
                                            onChange={handleChange}
                                        >
                                            <option value="relevance">Relevance</option>
                                            <option value="downloads">Downloads</option>
                                        </select>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="size-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Card>
                    {resultHits && <Card className="px-1 py-3">
                        <div className="flex flex-col px-2">
                            {
                                resultHits.map(item => {
                                    return (
                                        <div
                                            key={item.project_id}
                                            className="w-full h-16 flex flex-row space-x-2 items-center cursor-pointer rounded-lg hover:bg-blue-100 dark:hover:bg-neutral-700 transition-all"
                                            onClick={async () => setModProject(await client.getProject(item.project_id))}
                                        >
                                            <div className="ml-3 w-12 h-12 flex-shrink-0">
                                                <img
                                                    src={item.icon_url}
                                                    className="w-full h-full rounded-md"
                                                />
                                            </div>
                                            <div className="w-full h-full flex flex-col items-start justify-center">
                                                <p className="text-sm font-light text-gray-900 dark:text-gray-50">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-gray-400 w-xl lg:w-3xl xl:5xl whitespace-nowrap overflow-ellipsis overflow-hidden">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </Card>}
                </Container>
                :
                <Container>
                    <Card
                        className="px-4 py-2 mb-8 flex flex-col items-start"
                    >
                        <button
                            className="size-6 flex cursor-pointer"
                            onClick={() => setModProject(null)}
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
                                    src={modProject.icon_url}
                                    className="size-full rounded-md"
                                />
                            </div>
                            <div className="w-full h-full flex flex-col items-start justify-center">
                                <p className="text-sm text-gray-950 dark:text-gray-50">{modProject.title}</p>
                                <p className="md:w-xl lg:w-3xl xl:w-5xl text-xs overflow-hidden whitespace-nowrap text-ellipsis text-gray-400">{modProject.description}</p>
                                <div className="mt-1 w-full grid grid-cols-3">
                                    <div className="text-xs text-gray-400 inline-flex items-center gap-1">
                                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13v-2a1 1 0 0 0-1-1h-.757l-.707-1.707.535-.536a1 1 0 0 0 0-1.414l-1.414-1.414a1 1 0 0 0-1.414 0l-.536.535L14 4.757V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v.757l-1.707.707-.536-.535a1 1 0 0 0-1.414 0L4.929 6.343a1 1 0 0 0 0 1.414l.536.536L4.757 10H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.757l.707 1.707-.535.536a1 1 0 0 0 0 1.414l1.414 1.414a1 1 0 0 0 1.414 0l.536-.535 1.707.707V20a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-.757l1.707-.708.536.536a1 1 0 0 0 1.414 0l1.414-1.414a1 1 0 0 0 0-1.414l-.535-.536.707-1.707H20a1 1 0 0 0 1-1Z" />
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                        </svg>
                                        <p>{modProject.loaders.slice(0, 2).join(' / ')}</p>
                                        <p className="ml-0.5">{modProject.game_versions[0]}</p>
                                    </div>
                                    <div className="text-xs text-gray-400 inline-flex items-center gap-1">
                                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4" />
                                        </svg>
                                        {modProject.downloads}
                                    </div>
                                    <div className="text-xs text-gray-400 inline-flex items-center gap-1">
                                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 20V7m0 13-4-4m4 4 4-4m4-12v13m0-13 4 4m-4-4-4 4" />
                                        </svg>
                                        {toUTCStringPretty(modProject.updated)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    {modProject && projectVersions &&
                        <div className="flex flex-col">
                            {
                                modProject.game_versions.toReversed().map(version => {
                                    return (
                                        <div
                                            key={version}
                                            style={{ paddingBottom: expandedVersion === version && '1rem' }}
                                            className="px-4 mb-4 shadow-md rounded-lg bg-neutral-50 dark:bg-neutral-800 cursor-pointer"
                                        >
                                            <div
                                                className="transition-all duration-400 ease-in-out cursor-pointer"
                                            >
                                                <button
                                                    type="button"
                                                    className="px-2 py-3 w-full flex items-center justify-between cursor-pointer"
                                                    onClick={() => setExpandedVersion(prev => {
                                                        return prev === version ? null : version;
                                                    })}
                                                >
                                                    <div className="space-x-6 flex flex-row justify-start items-center">
                                                        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                            {version}
                                                        </h2>
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
                                                        maxHeight: expandedVersion === version ? `${contentHeight}px` : '0',
                                                        opacity: expandedVersion === version ? 1 : 0
                                                    }}
                                                    className="overflow-hidden transition-all duration-400 ease-in-out"
                                                >
                                                    <div
                                                        ref={fileContentRef}
                                                        className="flex flex-col px-2"
                                                    >
                                                        {
                                                            projectVersions.map(projectVersion => {
                                                                if (projectVersion.game_versions.includes(version))
                                                                    return (
                                                                        <div
                                                                            key={projectVersion.id}
                                                                            className="w-full h-12 flex flex-row space-x-3 items-center cursor-pointer rounded-lg hover:bg-blue-100 dark:hover:bg-neutral-700 transition-all"
                                                                        >
                                                                            <div className="ml-3 w-8 h-8 flex-shrink-0">
                                                                                <img
                                                                                    src={modProject.icon_url}
                                                                                    className="w-full h-full rounded-md"
                                                                                />
                                                                            </div>
                                                                            <div className="w-full h-full flex flex-col items-start justify-center">
                                                                                <p className="text-sm text-gray-700 dark:text-gray-50">{projectVersion.name}</p>
                                                                                <p className="text-xs text-gray-400">{toUTCStringPretty(projectVersion.date_published)}</p>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>}
                </Container>
            }
        </>
    );
}
