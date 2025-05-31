import { ModrinthV2Client, SearchResultHit } from '@xmcl/modrinth';
import { ChangeEvent, UIEvent, useEffect, useState } from 'react';
import { Card, Form, Input, ListItem, Pagination, ScrollMemoryContainer } from '@renderer/components/commons';
import ModInfoPage from './mod-info';
import { useInstallPage } from '@renderer/hooks/store';

type ModSearchFormData = {
    name: string;
    index: string;
};

const PAGE_HIT_LIMIT = 10;

const client = new ModrinthV2Client();

export default function ModsPage() {
    const { goTo, cacheMap } = useInstallPage();

    const [formData, setFormData] = useState<ModSearchFormData>({
        name: '',
        index: 'relevance'
    });
    const [resultHits, setResultHits] = useState<SearchResultHit[]>();
    const [pageIndex, setPageIndex] = useState<number>(cacheMap.get('pageIndex') || 1);
    const [totalPages, setTotalPages] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        searchMods();
        cacheMap.set('pageIndex', pageIndex);
    }, [pageIndex]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const searchMods = () => {
        setLoading(true);
        const from = (pageIndex - 1) * PAGE_HIT_LIMIT;
        const to = pageIndex * PAGE_HIT_LIMIT;
        client.searchProjects({
            query: formData.name,
            index: formData.name ? formData.index : 'downloads',
            limit: to
        }).then(res => {
            const totals = Number((res.total_hits / PAGE_HIT_LIMIT).toFixed(0));
            setTotalPages(totals >= 20 ? 20 : totals);
            setResultHits(from > 0 ? res.hits.slice(from - 1, to - 1) : res.hits);
            setLoading(false);
        }).catch(() => {
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
                contentLoaded={!!resultHits}
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
                        <div className="px-4 grid grid-cols-3 gap-5">
                            <div className="px-2 w-full h-9.5 col-span-2 flex flex-row space-x-3 items-center">
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
                            <div className="px-2 w-full h-9.5 col-span-1 flex flex-row space-x-3 items-center">
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
                {resultHits && !loading && <Card className="px-1 py-3 animate-[slide-down_0.4s_ease-in]">
                    <div className="flex flex-col px-2">
                        {
                            resultHits.map(hit => {
                                return (
                                    <ListItem
                                        src={hit.icon_url}
                                        variant="standard"
                                        title={hit.title}
                                        description={hit.description}
                                        onClick={async () => goTo(<ModInfoPage project={await client.getProject(hit.project_id)} />)}
                                    />
                                );
                            })
                        }
                    </div>
                </Card>}
                {!loading && <Pagination
                    currentPage={pageIndex}
                    totalPages={totalPages}
                    onPageChange={(i) => i > 0 && setPageIndex(i)}
                    className="mt-4"
                />}
            </ScrollMemoryContainer>
        </>
    );
}
