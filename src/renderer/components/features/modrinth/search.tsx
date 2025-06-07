import { ModrinthV2Client, SearchResultHit } from '@xmcl/modrinth';
import { ChangeEvent, UIEvent, useEffect, useRef, useState } from 'react';
import { Card, CircleSpinner, Form, Input, ListItem, Pagination, ScrollMemoryContainer, Select } from '@renderer/components/commons';
import { ModrinthDetail } from './detail';
import { useInstallPage } from '@renderer/hooks/store';

type ModSearchFormData = {
    name: string;
    index: 'relevance' | 'downloads';
    type: 'mod' | 'modpack' | 'resourcepack' | 'shader' | 'plugin';
};

const PAGE_HIT_LIMIT = 10;
const DEBOUNCE_DELAY = 300;

const client = new ModrinthV2Client();

export function ModrinthSearch() {
    const { goTo, cacheMap } = useInstallPage();

    const [formData, setFormData] = useState<ModSearchFormData>({
        name: cacheMap.get('search') || '',
        index: 'relevance',
        type: cacheMap.get('type') || 'mod',
    });
    const [resultHits, setResultHits] = useState<SearchResultHit[]>([]);
    const [pageIndex, setPageIndex] = useState<number>(cacheMap.get('page') || 1);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (resultHits.length === 0) {
            const hits = cacheMap.get('hits');
            if (hits)
                setResultHits(hits);
            else if (pageIndex > 1)
                changePage(pageIndex);
            else
                searchMods();
        }
        else if (formData)
            debounceSearchMods();
    }, [formData]);

    useEffect(() => {
        cacheMap.set('type', formData.type);
    }, [formData.type]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const searchMods = () => {
        setLoading(true);
        client.searchProjects({
            query: formData.name,
            index: formData.name ? formData.index : 'downloads',
            facets: JSON.stringify([[`project_type=${formData.type}`]])
        }).then(res => {
            if (res.hits.length === 0) {
                return;
            }
            cacheMap.set('search', formData.name);
            cacheMap.set('page', 1);
            cacheMap.set('hits', res.hits);
            setPageIndex(1);
            setResultHits(res.hits);
        }).finally(() => {
            setLoading(false);
        });
    };

    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const debounceSearchMods = () => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            searchMods();
            debounceTimer.current = null;
        }, DEBOUNCE_DELAY);
    };

    const changePage = (page: number) => {
        if (resultHits.length !== PAGE_HIT_LIMIT && page > pageIndex)
            return;

        setLoading(true);
        const offset = (page - 1) * PAGE_HIT_LIMIT;
        client.searchProjects({
            query: formData.name,
            index: formData.name ? formData.index : 'downloads',
            offset: offset,
            limit: PAGE_HIT_LIMIT,
            facets: JSON.stringify([[`project_type=${formData.type}`]])
        }).then(res => {
            if (res.hits.length === 0) {
                return;
            }
            cacheMap.set('search', formData.name);
            cacheMap.set('page', page);
            cacheMap.set('hits', res.hits);
            setPageIndex(page);
            setResultHits(res.hits);
        }).finally(() => {
            setLoading(false);
        });
    };

    const handleScroll = (event: UIEvent<HTMLDivElement>) => {
        const scrollTop = (event.target as Tentative).scrollTop;
        cacheMap.set('scrollTop', scrollTop);
    };

    return (
        <>
            <ScrollMemoryContainer
                onScroll={handleScroll}
                contentLoaded={(resultHits.length !== 0)}
                defaultPosition={cacheMap.get('scrollTop')}
            >
                <Card
                    title="Search for mods"
                    className="mb-5 animate-[slide-down_0.2s_ease-in]"
                >
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        searchMods();
                    }}>
                        <div className="px-4 grid grid-cols-4 lg:grid-cols-5 gap-1.5">
                            <div className="px-2 w-full h-9.5 col-span-2 lg:col-span-3 flex flex-row space-x-3 items-center">
                                <div className="w-14 shrink-0">
                                    <h3 className="text-sm text-gray-900 dark:text-gray-50 dark:bg-neutral-800 group">
                                        Name
                                    </h3>
                                </div>
                                <div className="w-full">
                                    <Input
                                        name="name"
                                        defaultValue={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="px-2 w-full h-9.5 col-span-2 flex flex-row space-x-3 items-center">
                                <div className="w-14 shrink-0">
                                    <h3 className="text-sm text-gray-900 dark:text-gray-50 dark:bg-neutral-800 group">
                                        Sort by
                                    </h3>
                                </div>
                                <div className="relative w-full items-center">
                                    <Select
                                        name="index"
                                        defaultValue={formData.index}
                                        onChange={handleChange}
                                        options={[
                                            { label: 'Relevance', value: 'relevance' },
                                            { label: 'Downloads', value: 'downloads' }
                                        ]}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="size-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                    </svg>
                                </div>
                                <div className="relative w-full items-center">
                                    <Select
                                        name="type"
                                        defaultValue={formData.type}
                                        onChange={handleChange}
                                        options={[
                                            { label: 'Mod', value: 'mod' },
                                            { label: 'Shader', value: 'shader' },
                                            { label: 'Resource Pack', value: 'resourcepack' },
                                            { label: 'Plugin', value: 'plugin' },
                                            { label: 'Datapack', value: 'datapack' },
                                        ]}
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="size-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Card>
                {loading ? (
                    <CircleSpinner text="Loading mods..." />
                ) : resultHits.length === 0 ? (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">No versions available</div>
                ) : (
                    <Card className="px-1 py-3 animate-[slide-down_0.4s_ease-in]">
                        <div className="flex flex-col px-2">
                            {
                                resultHits.map(hit => {
                                    return (
                                        <ListItem
                                            key={hit.title}
                                            src={hit.icon_url}
                                            variant="standard"
                                            title={hit.title}
                                            description={hit.description}
                                            onClick={async () => {
                                                cacheMap.set('hits', resultHits);
                                                goTo(<ModrinthDetail project={await client.getProject(hit.project_id)} hit={hit} />);
                                            }}
                                        />
                                    );
                                })
                            }
                        </div>
                    </Card>
                )}
                {resultHits?.length > 0 && !loading && <Pagination
                    currentPage={pageIndex}
                    onPageChange={(i) => {
                        changePage(i);
                    }}
                    className="mt-4"
                />}
            </ScrollMemoryContainer>
        </>
    );
}
